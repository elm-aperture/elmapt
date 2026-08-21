import type { Gallery } from "./types";

/* Layout arithmetic shared by the grid and the srcset.
 *
 * `span` is the cell's width in columns; a wide cell is square in cells, so
 * it spans the same number of rows. Because `sizes` is computed from the same
 * span the grid uses, the browser is always told the truth about how large
 * the image will be drawn. */

/* matches --elm-measure in @elmapt/theme */
const MEASURE = 1320;

/* matches the breakpoints in styles/gallery.css */
export const BREAK_WIDE = 1100;
export const BREAK_MID = 640;

export function spanFor(gallery: Gallery, frame: number): number {
  return gallery.wide.includes(frame) ? 2 : 1;
}

export function sizesFor(gallery: Gallery, span: number): string {
  const [wide, mid, narrow] = gallery.cols;
  const share = (cols: number) => `${((span / cols) * 100).toFixed(1)}vw`;

  /* Past the container's max width the grid stops growing with the viewport,
   * so the last rung is an absolute size rather than a share of the screen.
   * MEASURE is the border box; the gutters come out of it. */
  const capped = Math.round(((MEASURE - 80) * span) / wide);

  return [
    `(min-width: ${MEASURE + 96}px) ${capped}px`,
    `(min-width: ${BREAK_WIDE}px) ${share(wide)}`,
    `(min-width: ${BREAK_MID}px) ${share(mid)}`,
    share(narrow),
  ].join(", ");
}

/* ── squaring the grid ──────────────────────────────────────────────────
 *
 * A run always finishes as a complete rectangle, and the number of frames it
 * takes to get there is a constant, not a calculation. See FRAMES_PER_SET
 * and WIDE_POSITIONS in the manifest for the pair this rests on. */

export function runLength(block: number, frames: number): number {
  return Math.ceil(frames / block) * block;
}
