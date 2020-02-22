import { get } from 'lodash';
import { coordinate, IPiece, IRangedPiece } from '../pieces/IPieces.model';
import {
  IBoardState,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ISelectedPiece,
  IPossibleMoves,
  IPossibleMove,
} from './game';

export function generateEmptyHighlightedMoves(): IPossibleMoves {
  const highlightedMoves: IPossibleMove[][] = [];
  for (let x = 0; x < BOARD_HEIGHT; x++) {
    const currRow: IPossibleMove[] = [];
    for (let y = 0; y < BOARD_WIDTH; y++) {
      const noMovesSquare: IPossibleMove = {
        canMove: false,
        canAttack: false,
        inAttackRange: false,
      };
      currRow.push(noMovesSquare);
    }
    highlightedMoves.push(currRow);
  }
  return highlightedMoves;
}

export function generatePossibleMovesHighlights(
  src: coordinate,
  selectedPiece: ISelectedPiece,
  boardState: IBoardState,
): IPossibleMoves {
  const highlightedMoves = generateEmptyHighlightedMoves();
  if (!selectedPiece) {
    return highlightedMoves;
  }

  // get possible moves for vectors in all directions a piece can move; detect blocks and board end
  const dimensions: number[] = [-selectedPiece.moveRange, 0, selectedPiece.moveRange];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (x === 1 && y === 1) {
        continue; // just the square the piece is on
      }
      const dest = {
        x: getValidIndex(src.x + dimensions[x], BOARD_HEIGHT - 1),
        y: getValidIndex(src.y + dimensions[y], BOARD_WIDTH - 1),
      };
      const movesPath = getMovesPath(src, dest, boardState);

      for (let move of movesPath) {
        highlightedMoves[move.x][move.y].canMove = true;
        if (squareHasEnemyPiece(move, selectedPiece, boardState)) {
          highlightedMoves[move.x][move.y].canAttack = true;
        }
      }
    }
  }

  if ((selectedPiece as IRangedPiece).range) {
    const range = (selectedPiece as IRangedPiece).range;

    for (let x = Math.max(src.x - range, 0); x <= Math.min(src.x + range, BOARD_HEIGHT - 1); x++) {
      for (let y = Math.max(src.y - range, 0); y <= Math.min(src.y + range, BOARD_WIDTH - 1); y++) {
        highlightedMoves[x][y].inAttackRange = true;
      }
    }
  }

  return highlightedMoves;
}

// call this 8 times for each direction to get all possible moves
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

  const onHorizontalEdge = src.x === 0 || src.x === BOARD_HEIGHT - 1;
  const onVerticalEdge = src.y === 0 || src.y === BOARD_WIDTH - 1;
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
      (!onHorizontalEdge &&
        (currSquare.x === 0 || currSquare.x === BOARD_HEIGHT - 1) &&
        (xDelta !== 0 || yDelta !== 0)) ||
      (!onVerticalEdge &&
        (currSquare.y === 0 || currSquare.y === BOARD_WIDTH - 1) &&
        (yDelta !== 0 || xDelta !== 0))
    ) {
      break;
    }
  }

  return path;
}

function getValidIndex(index: number, maxIndex: number): number {
  if (index > maxIndex) {
    return maxIndex;
  } else if (index < 0) {
    return 0;
  } else {
    return index;
  }
}

export function isTargetValidRangedAttack(
  target: coordinate,
  selectedPiece: IRangedPiece,
  highlightState: IPossibleMoves,
  boardState: IBoardState,
): boolean {
  // TODO: how could this resolve to 0??????
  return (
    !!(selectedPiece as IRangedPiece).range &&
    (highlightState[target.x][target.y]?.inAttackRange ?? false) &&
    squareHasEnemyPiece(target, selectedPiece, boardState)
  );
}

function squareHasEnemyPiece(
  square: coordinate,
  selectedPiece: IPiece,
  boardState: IBoardState,
): boolean {
  return (
    get(boardState, `[${square.x}][${square.y}].player`, selectedPiece.player) !==
    selectedPiece.player
  );
}
