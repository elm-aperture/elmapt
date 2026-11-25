import { describe, expect, it } from "vitest";
import { runLength, sizesFor, spanFor } from "./mosaic";
import type { Gallery } from "./types";

const g: Gallery = {
  id: "t",
  dir: "d",
  slug: "t",
  count: 18,
  pad: 2,
  ratio: 1.5,
  spans: { 1: [3, 3] },
  cols: [6, 4, 3],
  block: 18,
};

describe("mosaic", () => {
  it("rounds a run up to whole blocks", () => {
    expect(runLength(18, 18)).toBe(18);
    expect(runLength(18, 19)).toBe(36);
    expect(runLength(6, 4)).toBe(6);
  });

  it("defaults frames to a single cell", () => {
    expect(spanFor(g, 1)).toEqual([3, 3]);
    expect(spanFor(g, 2)).toEqual([1, 1]);
  });

  it("sizes a big tile as a larger share of the viewport", () => {
    const big = sizesFor(g, [3, 3]);
    const small = sizesFor(g, [1, 1]);
    expect(big).toContain("50.0vw");
    expect(small).toContain("16.7vw");
  });
});
