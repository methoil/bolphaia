export enum playerIds {
  phrygians = 'phrygians',
  hitites = 'hitites',
}

export enum pieceTypes {
  levy = 'levy',
  archer = 'archer',
  cataphract = 'cataphract',
  hoplite = 'hoplite',
}

export const pieceDefs = [
  {
    pieceId: 'levy',
    maxHealth: 2,
  },
  {
    pieceId: 'archer',
    maxHealth: 2,
  },
  {
    pieceId: 'hoplite',
    maxHealth: 8,
  },
  {
    pieceId: 'cataphract',
    maxHealth: 10,
  },
];
