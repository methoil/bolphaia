var _ = require('lodash/core');
var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var chatkit = require('./chatkit');
var pieceMeta = require('../res/pieceMetadata.json');

var pusher = new Pusher({
  appId: '941125',
  key: '6e48a6609db3a8a6b150',
  secret: 'fb33e58cef4d8e9e574c',
  cluster: 'mt1',
  encrypted: true,
});

const BOARD_WIDTH: number = 24;
const BOARD_HEIGHT: number = 16;
const games = {};

interface IPieceMeta {
  pieceType: string,
  player: string,
  health: number,
}

router.post('/', (req, res) => {
  const room = req.body.room;
  const white = req.body.whitePlayer;
  const black = req.body.blackPlayer;
  const newGame = {
    players: {
      [white]: 'phyrigians',
      [black]: 'hitites',
    },
    board: initBoard(),
  };
  games[room] = newGame;
  chatkit
    .assignRoomRoleToUser({
      userId: white,
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
    userId: black,
    name: 'Player',
    roomId: room,
  });
  res.send(newGame);
});

router.get('/:room', (req, res) => {
  const room = req.params.room;
  const game = games[room];
  if (game) {
    res.send(game);
  } else {
    res.status(404).send(`Game not found: ${room}`);
  }
});

router.post('/:room', (req, res) => {
  const room = req.params.room;
  const player = req.body.player;
  const fromRow = req.body.fromRow;
  const fromColumn = req.body.fromColumn;
  const toRow = req.body.toRow;
  const toColumn = req.body.toColumn;
  const game = games[room];
  if (game) {
    const piece = game.board[fromRow][fromColumn];
    const playerSide = game.players[player];
    if (piece == '  ') {
      res.status(400).send(`No piece in that square: ${fromRow}x${fromColumn}`);
    } else if (!playerSide) {
      res.status(400).send(`Not a player: ${player}`);
    } else if (
      (playerSide === 'white' && piece[0] !== 'W') ||
      (playerSide === 'black' && piece[0] !== 'B')
    ) {
      res.status(400).send(`Not your piece. Player=${playerSide}, Piece=${piece}`);
    } else {
      game.board[fromRow][fromColumn] = '  ';
      game.board[toRow][toColumn] = piece;
      res.send(game);
      pusher.trigger('game-' + room, 'board-updated', {});
    }
  } else {
    res.status(404).send(`Game not found: ${room}`);
  }
});

module.exports = router;



function initBoard(): Array<IPieceMeta | null>[] {
  const boardState: Array<IPieceMeta | null>[] = [];
  for (let x = 0; x < BOARD_HEIGHT; x++) {
    let pieceToPlace: IPieceMeta | null = null;
    if (x === 1) {
      const rowArray: Array<IPieceMeta | null> = new Array(BOARD_WIDTH).fill(null);
      rowArray[2] = makePiece('phrygians', 'cataphract');
      rowArray[rowArray.length - 3] = rowArray[4] = makePiece('phrygians', 'cataphract');

      rowArray[4] = makePiece('phrygians', 'archer');
      rowArray[7] = makePiece('phrygians', 'archer');
      rowArray[10] = makePiece('phrygians', 'archer');
      rowArray[13] = makePiece('phrygians', 'archer');
      rowArray[16] = makePiece('phrygians', 'archer');
      rowArray[19] = makePiece('phrygians', 'archer');

      boardState.push(rowArray);
      continue;
    } else if (x === 2) {
      pieceToPlace = makePiece('phrygians', 'hoplite');
    } else if (x === 3) {
      pieceToPlace = makePiece('phrygians', 'levy');
    } else if (x === BOARD_HEIGHT - 4) {
      pieceToPlace = makePiece('hitites', 'levy');
    } else if (x === BOARD_HEIGHT - 3) {
      pieceToPlace = makePiece('hitites', 'hitites');
    } else if (x === BOARD_HEIGHT - 2) {
      const rowArray = new Array(BOARD_WIDTH).fill(null);
      rowArray[2] = makePiece('hitites', 'cataphract');
      rowArray[BOARD_WIDTH - 3] = makePiece('hitites', 'cataphract');

      rowArray[4] = makePiece('hitites', 'archer');
      rowArray[7] = makePiece('hitites', 'archer');
      rowArray[10] = makePiece('hitites', 'archer');
      rowArray[13] = makePiece('hitites', 'archer');
      rowArray[16] = makePiece('hitites', 'archer');
      rowArray[19] = makePiece('hitites', 'archer');
      boardState.push(rowArray);
      continue;
    }

    boardState.push(new Array(BOARD_WIDTH).fill(pieceToPlace));
  }
  return boardState;
}

function makePiece(player: string, pieceId: string): IPieceMeta {
  return _.extend(_.find(pieceMeta, (meta) => meta.pieceId === pieceId), {player});
}