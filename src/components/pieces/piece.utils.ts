import { coordinate } from "./IPieces";
import { IBoardState } from "../game";

// call this 8 times to get all possible moves
// assumes no trample; 
export function getMovesPath(
  src: coordinate,
  dest: coordinate,
  board: IBoardState
): coordinate[] {
  let xDelta = dest.x - src.x;
  let yDelta = dest.y - src.y;
  const isXNegative: boolean = xDelta < 0;
  const isYNegative: boolean = yDelta < 0;
  let xOffset: number = 0;
  let yOffset: number = 0;
  const path: coordinate[] = [];

  while (xDelta !== 0 || yDelta !== 0) {
    if (xDelta !== 0) {
      xOffset += isXNegative ? -1 : 1;
      xDelta += isXNegative ? 1 : -1;
    }
    if (yDelta !== 0) {
      yOffset += isYNegative ? -1 : 1;
      yDelta += isYNegative ? 1 : -1;
    }

    if (board[src.x + xOffset][src.y + yOffset] !== null) {
      break;
    }

    path.push({ x: src.x + xOffset, y: src.y + yOffset });
  }

  return path;
}
