import BasePiece from "./piece";
import { coordinate } from "./IPieces";

import whiteCataphractImageSvg from "../../resources/whiteCataphract.svg";
import blackCataphractImageSvg from "../../resources/blackCataphract.svg";

export default class Cataphract extends BasePiece {
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

  getMovesPath(src: coordinate, dest: coordinate) {
    let xDelta = dest.x - src.x;
    let yDelta = dest.y - src.y;
    const isXNegative: boolean = xDelta < 0;
    const isYNegative: boolean = yDelta < 0;
    let xOffset: number = 0;
    let yOffset: number = 0;
    const path: coordinate[] = [];

    while (xDelta !== 0 && yDelta !== 0) {
      if (xDelta !== 0) {
        xOffset += isXNegative ? -1 : 1;
        xDelta += isXNegative ? 1 : -1;
      }
      if (yDelta !== 0) {
        yOffset += isYNegative ? -1 : 1;
        yDelta += isYNegative ? 1 : -1;
      }
      path.push({ x: src.x + xOffset, y: src.y + yOffset });
    }

    return path;
  };
}
