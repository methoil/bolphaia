import { playerIds, pieceTypes } from "../game.model";

export type coordinate = {
  x: number;
  y: number;
};

export interface IBasePiece {
  pieceType: pieceTypes;
  player: playerIds;
  isSelected: boolean;
  health: number;
  maxHealth: number;
  attack: number;
  moveRange: number;
  takeDamage: (damage: number) => void;
  getImageUrl: () => string;
}

export interface IPiece extends IBasePiece {
  setHealth: (health: number) => void;
}
export interface IRangedPiece extends IPiece {
  range: number;
}
