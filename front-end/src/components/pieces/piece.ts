import { IBasePiece } from "./IPieces.model";
import { playerIds } from "../game.model";

export default abstract class BasePiece implements IBasePiece {
  public player: playerIds;
  public isSelected: boolean = false;
  abstract health = 0;
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

  abstract getImageUrl(): string;
}
