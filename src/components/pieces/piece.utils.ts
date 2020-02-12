import { coordinate } from "./IPieces.model";
import { IBoardState, BOARD_WIDTH, BOARD_HEIGHT } from "../game/game";

// call this 8 times to get all possible moves
// assumes no trample;
export function getMovesPath(src: coordinate, dest: coordinate, board: IBoardState): coordinate[] {
  if (dest.x < 0 || src.x < 0 || dest.y < 0 || src.y < 0) {
    return [];
  }
  let xDelta = dest.x - src.x;
  let yDelta = dest.y - src.y;
  const isXNegative: boolean = xDelta < 0;
  const isYNegative: boolean = yDelta < 0;
  let xOffset: number = 0;
  let yOffset: number = 0;
  const path: coordinate[] = [src];

  const selectedPiece = board[src.x][src.y];
  if (!selectedPiece) {
    return [];
  }

  while (xDelta !== 0 || yDelta !== 0) {
    if (xDelta !== 0) {
      xOffset += isXNegative ? -1 : 1;
      xDelta += isXNegative ? 1 : -1;
    }
    if (yDelta !== 0) {
      yOffset += isYNegative ? -1 : 1;
      yDelta += isYNegative ? 1 : -1;
    }

    const destSquare = board[src.x + xOffset][src.y + yOffset];
    const currSquare = { x: src.x + xOffset, y: src.y + yOffset };
    if (destSquare !== null) {
      if (selectedPiece.player !== destSquare.player) {
        path.push(currSquare);
      }
      break;
    }

    path.push(currSquare);

    // edge reached - stop finding path
    if (
      ((currSquare.x === 0 || currSquare.x === BOARD_HEIGHT - 1) && yDelta !== 0) ||
      ((currSquare.y === 0 || currSquare.y === BOARD_WIDTH - 1) && xDelta !== 0)
    ) {
      break;
    }
  }

  return path;
}
