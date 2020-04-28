import { getValidIndex } from "../moveHighlightSvc";

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
