import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteWarElephantImageSvg from "../../resources/warElephantWhite.svg";
import blackWarElephantImageSvg from "../../resources/warElephantBlack.svg";

export default class WarElephant extends BasePiece {
  public pieceType = pieceTypes.warElephant;
  public moveRange: number = 4;
  public health: number = 24;
  readonly maxHealth: number = 24;
  public attack: number = 8;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteWarElephantImageSvg : blackWarElephantImageSvg;
  }
}
