import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteCataphractImageSvg from "../../resources/cataphractWhite.svg";
import blackCataphractImageSvg from "../../resources/cataphractBlack.svg";

export default class Cataphract extends BasePiece {
  public pieceType = pieceTypes.cataphract;
  public moveRange: number = 5;
  public health: number = 10;
  readonly maxHealth: number = 10;
  public attack: number = 6;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteCataphractImageSvg : blackCataphractImageSvg;
  }
}
