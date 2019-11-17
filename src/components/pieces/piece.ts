import { playerIds, IBasePiece } from "./IPieces";

export default class BasePiece implements IBasePiece {
  public player: playerIds;
  public isSelected: boolean = false;

  constructor(player: playerIds) {
    this.player = player;
  }
}
