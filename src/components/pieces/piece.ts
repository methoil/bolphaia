import { playerIds, IBasePiece } from "./IPieces";

export default abstract class BasePiece implements IBasePiece {
  public player: playerIds;
  public isSelected: boolean = false;
  abstract health = 0;
  abstract attack = 0;
  abstract moveRange = 0;

  constructor(player: playerIds) {
    this.player = player;
  }

  public takeDamage(damage: number): number {
    this.health = this.health = damage;
    return this.health;
  }

  abstract getImageUrl(): string;
}
