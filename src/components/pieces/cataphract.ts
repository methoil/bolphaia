import BasePiece from "./piece";
import { coordinate } from "./IPieces";

import whiteCataphractImageSvg from "../../resources/whiteCataphract.svg";
import blackCataphractImageSvg from "../../resources/blackCataphract.svg";
import { IBoardState } from "../game";

export default class Cataphract extends BasePiece {
  public moveRange: number = 5;


  getImageUrl() {
    return this.player === "slavs"
      ? whiteCataphractImageSvg
      : blackCataphractImageSvg;
  }

  isMovePossible(src: coordinate, dest: coordinate): boolean {
    const maxMoves = 5;
    const xDelta = Math.abs(dest.x - src.x);
    const yDelta = Math.abs(dest.y - src.y);

    return (
      (xDelta <= maxMoves && yDelta === 0) ||
      (xDelta === 0 && yDelta <= maxMoves) ||
      (xDelta <= maxMoves && yDelta <= maxMoves && xDelta === yDelta)
    );
  }
}
