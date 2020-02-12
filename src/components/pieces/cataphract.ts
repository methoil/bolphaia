import BasePiece from "./piece";
import { playerIds, pieceTypes } from "../game/game.model";
import whiteCataphractImageSvg from "../../resources/whiteCataphract.svg";
import blackCataphractImageSvg from "../../resources/blackCataphract.svg";

export default class Cataphract extends BasePiece {
  public pieceType = pieceTypes.cataphract;
  public moveRange: number = 5;
  public health: number = 10;
  readonly maxHealth: number = 10;
  public attack: number = 5;

  getImageUrl() {
    return this.player === playerIds.phrygians ? whiteCataphractImageSvg : blackCataphractImageSvg;
  }
}