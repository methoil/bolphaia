"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { playerIds } = require('../models/pieceMeta.model');
var pieceMeta_model_1 = require("../models/pieceMeta.model");
var _ = require('lodash/core');
var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var chatkit = require('./chatkit');
var pusher = new Pusher({
    appId: '941125',
    key: '6e48a6609db3a8a6b150',
    secret: 'fb33e58cef4d8e9e574c',
    cluster: 'mt1',
    encrypted: true,
});
// TODO: import these...
var playerIds;
(function (playerIds) {
    playerIds["phrygians"] = "phrygians";
    playerIds["hitites"] = "hitites";
})(playerIds || (playerIds = {}));
var BOARD_WIDTH = 24;
var BOARD_HEIGHT = 16;
var games = {};
var lastUpdate = {
    player: null,
    updatedSquares: [],
};
router.post('/', function (req, res) {
    var _a;
    var room = req.body.room;
    var phrygianPlayerId = req.body.whitePlayer;
    var hititePlayerId = req.body.blackPlayer;
    var newGame = {
        players: (_a = {},
            _a[phrygianPlayerId] = playerIds.phrygians,
            _a[hititePlayerId] = playerIds.hitites,
            _a),
        board: initBoard(),
    };
    games[room] = newGame;
    chatkit
        .assignRoomRoleToUser({
        userId: phrygianPlayerId,
        name: 'Player',
        roomId: room,
    })
        .then(function (res) {
        console.log('success');
        console.log(res);
    })
        .catch(function (err) {
        console.log('no role :(');
        console.log(err);
    });
    chatkit.assignRoomRoleToUser({
        userId: hititePlayerId,
        name: 'Player',
        roomId: room,
    });
    res.send(newGame);
});
router.get('/:room', function (req, res) {
    var _a, _b;
    var room = req.params.room;
    var game = games[room];
    if (game) {
        game.player = (_a = lastUpdate) === null || _a === void 0 ? void 0 : _a.player;
        game.updatedSquares = (_b = lastUpdate) === null || _b === void 0 ? void 0 : _b.updatedSquares;
        res.send(game);
    }
    else {
        res.status(404).send("Game not found: " + room);
    }
});
router.post('/:room', function (req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var room = req.params.room;
    var player = req.body.player;
    var game = games[room];
    var fromRow = (_c = (_b = (_a = req) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.updatedSquares) === null || _c === void 0 ? void 0 : _c[0].row;
    var fromColumn = (_f = (_e = (_d = req) === null || _d === void 0 ? void 0 : _d.body) === null || _e === void 0 ? void 0 : _e.updatedSquares) === null || _f === void 0 ? void 0 : _f[0].col;
    var fromPiece = (_j = (_h = (_g = req) === null || _g === void 0 ? void 0 : _g.body) === null || _h === void 0 ? void 0 : _h.updatedSquares) === null || _j === void 0 ? void 0 : _j[0].piece;
    var toRow = (_m = (_l = (_k = req) === null || _k === void 0 ? void 0 : _k.body) === null || _l === void 0 ? void 0 : _l.updatedSquares) === null || _m === void 0 ? void 0 : _m[1].row;
    var toColumn = (_q = (_p = (_o = req) === null || _o === void 0 ? void 0 : _o.body) === null || _p === void 0 ? void 0 : _p.updatedSquares) === null || _q === void 0 ? void 0 : _q[1].col;
    var toPiece = (_t = (_s = (_r = req) === null || _r === void 0 ? void 0 : _r.body) === null || _s === void 0 ? void 0 : _s.updatedSquares) === null || _t === void 0 ? void 0 : _t[1].toColumn;
    if (game) {
        var piece = game.board[fromRow][fromColumn];
        var playerSide = game.players[player];
        if (!playerSide) {
            res.status(400).send("Not a player: " + player);
            // can't rely on bc of damage but not killed
            // } else if (playerSide !== fromPiece.player) {
            //   res.status(400).send(`Not your piece. Player=${playerSide}, Piece=${piece}`);
        }
        else {
            game.board[fromRow][fromColumn] = fromPiece;
            game.board[toRow][toColumn] = toPiece;
            // just resend the data, client will ignore if it's their move
            // no need to resend the whole board - maybe when/if there's more validation?
            lastUpdate = req.body;
            res.send(req.body);
            pusher.trigger('game-' + room, 'board-updated', {});
        }
    }
    else {
        res.status(404).send("Game not found: " + room);
    }
});
function initBoard() {
    var boardState = [];
    for (var x = 0; x < BOARD_HEIGHT; x++) {
        var pieceToPlace = null;
        if (x === 1) {
            var rowArray = new Array(BOARD_WIDTH).fill(null);
            rowArray[2] = makePhrygianPiece('cataphract');
            rowArray[rowArray.length - 3] = rowArray[4] = makePhrygianPiece('cataphract');
            rowArray[4] = makePhrygianPiece('archer');
            rowArray[7] = makePhrygianPiece('archer');
            rowArray[10] = makePhrygianPiece('archer');
            rowArray[13] = makePhrygianPiece('archer');
            rowArray[16] = makePhrygianPiece('archer');
            rowArray[19] = makePhrygianPiece('archer');
            boardState.push(rowArray);
            continue;
        }
        else if (x === 2) {
            pieceToPlace = makePhrygianPiece('hoplite');
        }
        else if (x === 3) {
            pieceToPlace = makePhrygianPiece('levy');
        }
        else if (x === BOARD_HEIGHT - 4) {
            pieceToPlace = makeHititePiece('levy');
        }
        else if (x === BOARD_HEIGHT - 3) {
            pieceToPlace = makeHititePiece(playerIds.hitites);
        }
        else if (x === BOARD_HEIGHT - 2) {
            var rowArray = new Array(BOARD_WIDTH).fill(null);
            rowArray[2] = makeHititePiece('cataphract');
            rowArray[BOARD_WIDTH - 3] = makeHititePiece('cataphract');
            rowArray[4] = makeHititePiece('archer');
            rowArray[7] = makeHititePiece('archer');
            rowArray[10] = makeHititePiece('archer');
            rowArray[13] = makeHititePiece('archer');
            rowArray[16] = makeHititePiece('archer');
            rowArray[19] = makeHititePiece('archer');
            boardState.push(rowArray);
            continue;
        }
        boardState.push(new Array(BOARD_WIDTH).fill(pieceToPlace));
    }
    return boardState;
}
function makePhrygianPiece(pieceId) {
    return makePiece(playerIds.phrygians, pieceId);
}
function makeHititePiece(pieceId) {
    return makePiece(playerIds.hitites, pieceId);
}
function makePiece(player, pieceId) {
    return _.extend(_.find(pieceMeta_model_1.pieceDefs, function (meta) { return meta.pieceId === pieceId; }), { player: player });
}
module.exports = router;
