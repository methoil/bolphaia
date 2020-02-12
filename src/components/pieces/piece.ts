import { IBasePiece } from './IPieces.model';
import { playerIds, pieceTypes } from '../game/game.model';

export default abstract class BasePiece implements IBasePiece {
  public player: playerIds;
  public isSelected: boolean = false;
  abstract pieceType = pieceTypes.levy;
  abstract health;
  abstract readonly maxHealth: number;
  abstract attack = 0;
  abstract moveRange = 0;

  constructor(player: playerIds) {
    this.player = player;
  }

  public takeDamage(damage: number): number {
    this.health = this.health - damage;
    return this.health;
  }

  public setHealth(health) {
    this.health = health;
  }

  abstract getImageUrl(): string;
}
