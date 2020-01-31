import { playerIds } from "../game.model";

export type coordinate = {
  x: number;
  y: number;
};

export interface IBasePiece {
  player: playerIds;
  isSelected: boolean;
  health: number;
  maxHealth: number;
  attack: number;
  moveRange: number;
  takeDamage: (damage: number) => void;
  getImageUrl: () => string;
}

export interface IPiece extends IBasePiece {}
export interface IRangedPiece extends IBasePiece {
  range: number;
}