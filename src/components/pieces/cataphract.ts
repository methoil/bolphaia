import BasePiece from "./piece";
import { coordinate } from "./IPieces.model";

import whiteCataphractImageSvg from "../../resources/whiteCataphract.svg";
import blackCataphractImageSvg from "../../resources/blackCataphract.svg";

export default class Cataphract extends BasePiece {
  public moveRange: number = 5;
  public health: number = 10;
  public attack: number = 5;

  getImageUrl() {
    return this.player === "slavs" ? whiteCataphractImageSvg : blackCataphractImageSvg;
  }
}
