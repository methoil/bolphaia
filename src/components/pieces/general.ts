import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteGeneralImageSvg from "../../resources/generalWhite.svg";
import blackGeneralImageSvg from "../../resources/generalBlack.svg";

export default class General extends BasePiece {
  public pieceType = pieceTypes.general;
  public moveRange: number = 5;
  public health: number = 10;
  readonly maxHealth: number = 10;
  public attack: number = 6;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteGeneralImageSvg : blackGeneralImageSvg;
  }
}
