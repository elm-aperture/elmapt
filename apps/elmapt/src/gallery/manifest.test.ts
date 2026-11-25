import { describe, expect, it } from "vitest";
import { categories, publish } from "./manifest";
import { runLength } from "./mosaic";
import { plateFor, sourceFrame } from "./sources";
import { UNATTRIBUTED } from "./types";
import type { Gallery, Plate } from "./types";

const real = (title: string): Plate => ({ title, by: "Rain" });
const filler: Plate = { title: "filler image", by: UNATTRIBUTED };

function gallery(overrides: Partial<Gallery>): Gallery {
  return {
    id: "test",
    dir: "portrait",
    slug: "test",
    count: 6,
    pad: 2,
    ratio: 1,
    spans: {},
    cols: [6, 3, 2],
    block: 6,
    ...overrides,
  };
}

const galleries = categories.flatMap((category) =>
  category.work.flatMap((work) =>
    work.caseStudy ? [work.gallery, work.caseStudy.gallery] : [work.gallery],
  ),
);

describe("publish", () => {
  it("returns a full, block-sized gallery untouched", () => {
    const full = gallery({ plates: Array.from({ length: 6 }, (_, i) => real(`${i}`)) });
    expect(publish(full)).toBe(full);
  });

  it("drops filler frames and renumbers what remains", () => {
    const g = gallery({
      order: [1, 5, 2, 6, 3, 4],
      plates: [real("a"), real("b"), filler, real("d"), real("e"), filler],
      spans: { 2: [2, 2], 5: [3, 3] },
      focus: { 2: "50% 10%", 4: "50% 90%" },
    });

    const out = publish(g);

    // Display positions 4 (source 6) and 5 (source 3) were filler.
    expect(out.count).toBe(4);
    expect(out.order).toEqual([1, 5, 2, 4]);
    expect(out.spans).toEqual({});
    expect(out.focus).toEqual({ 2: "50% 10%" });
    expect(out.ragged).toBe(true);
    for (let frame = 1; frame <= out.count; frame += 1) {
      expect(plateFor(out, frame)?.by).not.toBe(UNATTRIBUTED);
    }
  });

  it("marks a short gallery ragged so it is not padded with open frames", () => {
    const short = gallery({
      count: 3,
      plates: [real("a"), real("b"), real("c")],
      spans: { 1: [3, 3] },
    });
    const out = publish(short);
    expect(out.count).toBe(3);
    expect(out.ragged).toBe(true);
    expect(out.cols).toEqual([3, 3, 2]);
    expect(out.spans).toEqual({});
  });

  it("empties a gallery made only of filler", () => {
    const out = publish(gallery({ count: 2, plates: [filler, filler] }));
    expect(out.count).toBe(0);
  });
});

describe("manifest integrity", () => {
  it.each(galleries.map((g) => [g.id, g] as const))(
    "%s: order is a set of distinct frames that all have plates",
    (_, g) => {
      if (!g.order) return;
      expect(g.order).toHaveLength(g.count);
      expect(new Set(g.order).size).toBe(g.order.length);
      if (g.plates) {
        for (const source of g.order) {
          expect(source).toBeGreaterThanOrEqual(1);
          expect(source).toBeLessThanOrEqual(g.plates.length);
        }
      }
    },
  );

  it.each(galleries.map((g) => [g.id, g] as const))(
    "%s: spans fit the block and focus points at frames that exist",
    (_, g) => {
      // Spans may reach past the last frame: they also shape the open frames
      // that pad a short gallery out to its block in development.
      for (const key of Object.keys(g.spans)) {
        expect(Number(key)).toBeLessThanOrEqual(runLength(g.block, g.count));
      }
      for (const key of Object.keys(g.focus ?? {})) {
        expect(Number(key)).toBeLessThanOrEqual(g.count);
      }
    },
  );

  it("every cover points at a frame in its gallery", () => {
    for (const category of categories) {
      for (const work of category.work) {
        if (work.cover === undefined) continue;
        expect(work.cover).toBeGreaterThanOrEqual(1);
        expect(work.cover).toBeLessThanOrEqual(work.gallery.count);
      }
    }
  });

  it("source frames resolve through order", () => {
    const g = gallery({ order: [3, 1, 2], count: 3 });
    expect([1, 2, 3].map((f) => sourceFrame(g, f))).toEqual([3, 1, 2]);
    expect(sourceFrame(gallery({}), 4)).toBe(4);
  });
});
