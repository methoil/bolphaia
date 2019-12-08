export type playerIds = "slavs" | "thracians";
export type coordinate = {
  x: number;
  y: number;
};

export interface IBasePiece {
  player: playerIds;
  isSelected: boolean;
  health: number;
  attack: number;
  moveRange: number;
  takeDamage: (damage: number) => void;
  getImageUrl: () => string;
}

export interface IPiece extends IBasePiece {}
