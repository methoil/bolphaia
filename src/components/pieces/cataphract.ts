import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteCataphractImageSvg from "../../resources/cataphractWhite.svg";
import blackCataphractImageSvg from "../../resources/cataphractBlack.svg";

export default class Cataphract extends BasePiece {
  public pieceType = pieceTypes.cataphract;
  public moveRange: number = 5;
  public health: number = 8;
  readonly maxHealth: number = 8;
  public attack: number = 5;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteCataphractImageSvg : blackCataphractImageSvg;
  }
}
