import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteChariotImageSvg from "../../resources/chariotWhite.svg";
import blackChariotImageSvg from "../../resources/chariotBlack.svg";

export default class Chariot extends BasePiece {
  public pieceType = pieceTypes.chariot;
  public moveRange: number = 3;
  public health: number = 10;
  readonly maxHealth: number = 10;
  public attack: number = 3;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteChariotImageSvg : blackChariotImageSvg;
  }
}
