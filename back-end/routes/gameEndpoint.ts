// import { playerIds } = require('../models/pieceMeta.model');
import { pieceDefs } from '../models/pieceMeta.model';

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
enum playerIds {
  phrygians = 'phrygians',
  hitites = 'hitites',
}

const BOARD_WIDTH: number = 24;
const BOARD_HEIGHT: number = 16;
const games = {};
let lastUpdate = {
  player: null,
  updatedSquares: [],
};

interface IPieceMeta {
  pieceType: string;
  player: string;
  health: number;
}

router.post('/', (req, res) => {
  const room = req.body.room;
  const phrygianPlayerId = req.body.whitePlayer;
  const hititePlayerId = req.body.blackPlayer;
  const newGame = {
    players: {
      [phrygianPlayerId]: playerIds.phrygians,
      [hititePlayerId]: playerIds.hitites,
    },
    board: initBoard(),
  };

  games[room] = newGame;
  chatkit
    .assignRoomRoleToUser({
      userId: phrygianPlayerId,
      name: 'Player',
      roomId: room,
    })
    .then(res => {
      console.log('success');
      console.log(res);
    })
    .catch(err => {
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

router.get('/:room', (req, res) => {
  const room = req.params.room;
  const game = games[room];
  if (game) {
    game.player = lastUpdate?.player;
    game.updatedSquares = lastUpdate?.updatedSquares;
    res.send(game);
  } else {
    res.status(404).send(`Game not found: ${room}`);
  }
});

router.post('/:room', (req, res) => {
  const room = req.params.room;
  const player = req.body.player;
  const game = games[room];

  const fromRow = req?.body?.updatedSquares?.[0].row;
  const fromColumn = req?.body?.updatedSquares?.[0].col;
  const fromPiece = req?.body?.updatedSquares?.[0].piece;

  const toRow = req?.body?.updatedSquares?.[1].row;
  const toColumn = req?.body?.updatedSquares?.[1].col;
  const toPiece = req?.body?.updatedSquares?.[1].toColumn;

  if (game) {
    const piece = game.board[fromRow][fromColumn];
    const playerSide = game.players[player];

    if (!playerSide) {
      res.status(400).send(`Not a player: ${player}`);
      // can't rely on bc of damage but not killed
      // } else if (playerSide !== fromPiece.player) {
      //   res.status(400).send(`Not your piece. Player=${playerSide}, Piece=${piece}`);
    } else {
      game.board[fromRow][fromColumn] = fromPiece;
      game.board[toRow][toColumn] = toPiece;

      // just resend the data, client will ignore if it's their move
      // no need to resend the whole board - maybe when/if there's more validation?
      lastUpdate = req.body;
      res.send(req.body);
      pusher.trigger('game-' + room, 'board-updated', {});
    }
  } else {
    res.status(404).send(`Game not found: ${room}`);
  }
});

function initBoard(): Array<IPieceMeta | null>[] {
  const boardState: Array<IPieceMeta | null>[] = [];
  for (let x = 0; x < BOARD_HEIGHT; x++) {
    let pieceToPlace: IPieceMeta | null = null;
    if (x === 1) {
      const rowArray: Array<IPieceMeta | null> = new Array(BOARD_WIDTH).fill(null);
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
    } else if (x === 2) {
      pieceToPlace = makePhrygianPiece('hoplite');
    } else if (x === 3) {
      pieceToPlace = makePhrygianPiece('levy');
    } else if (x === BOARD_HEIGHT - 4) {
      pieceToPlace = makeHititePiece('levy');
    } else if (x === BOARD_HEIGHT - 3) {
      pieceToPlace = makeHititePiece(playerIds.hitites);
    } else if (x === BOARD_HEIGHT - 2) {
      const rowArray = new Array(BOARD_WIDTH).fill(null);
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

function makePhrygianPiece(pieceId: string) {
  return makePiece(playerIds.phrygians, pieceId);
}

function makeHititePiece(pieceId: string) {
  return makePiece(playerIds.hitites, pieceId);
}

function makePiece(player: playerIds, pieceId: string): IPieceMeta {
  return _.extend(
    _.find(pieceDefs, meta => meta.pieceId === pieceId),
    { player },
  );
}

module.exports = router;
