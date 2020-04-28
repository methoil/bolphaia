import {
  getValidIndex,
  generateEmptyHighlightedMoves,
} from "../moveHighlightSvc";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../boardSetup";

describe("generateEmptyHighlightedMoves", () => {
  const testMatrix = generateEmptyHighlightedMoves();

  test("should have BOARD_WIDTH number of columns", () => {
    expect(testMatrix[0].length).toBe(BOARD_WIDTH);
  });

  test("should have BOARD_HEIGHT number of rows", () => {
    expect(testMatrix.length).toBe(BOARD_HEIGHT);
  });
  test("should each entry in the matrix be an PossibleMove with everything set to false", () => {
    const emptyMove = {
      canMove: false,
      canAttack: false,
      inAttackRange: false,
    };

    for (let x = 0; x < BOARD_HEIGHT; x++) {
      for (let y = 0; y < BOARD_WIDTH; y++) {
        expect(testMatrix[x][y]).toEqual(emptyMove);
      }
    }
  });
});

describe("getValidIndex", () => {
  test("should return the input index if it is within range", () => {
    const idx = getValidIndex(4, 10);
    expect(idx).toBe(4);
  });

  test("should return 0 if the input index is below the range", () => {
    const idx = getValidIndex(-4, 10);
    expect(idx).toBe(0);
  });

  test("should return the maxIndex if the input index is above the range", () => {
    const idx = getValidIndex(12, 10);
    expect(idx).toBe(10);
  });
});
