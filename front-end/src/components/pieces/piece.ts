import { IBasePiece } from './IPieces.model';
import { playerIds, pieceTypes } from '../game.model';

export default abstract class BasePiece implements IBasePiece {
  public player: playerIds;
  public isSelected: boolean = false;
  abstract pieceType = pieceTypes.levy;
  public health = -1;
  abstract readonly maxHealth: number;
  abstract attack = 0;
  abstract moveRange = 0;

  constructor(player: playerIds, health?: number) {
    this.player = player;
    if (health) { // TODO: this may break health setting in child pieces
      this.health = health || -1;
    }
  }

  public takeDamage(damage: number): number {
    this.health = this.health - damage;
    return this.health;
  }

  abstract getImageUrl(): string;
}
