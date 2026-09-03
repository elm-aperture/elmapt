import type { Gallery, Span } from "./types";

const MEASURE = 1720;

export const BREAK_WIDE = 1100;
export const BREAK_MID = 640;

const CELL: Span = [1, 1];

export function spanFor(gallery: Gallery, frame: number): Span {
  return gallery.spans[frame] ?? CELL;
}

function drawnColumns([cols, rows]: Span): number {
  return Math.max(cols, rows);
}

export function sizesFor(gallery: Gallery, span: Span): string {
  const [wide, mid, narrow] = gallery.cols;
  const drawn = drawnColumns(span);
  const share = (cols: number) => `${((drawn / cols) * 100).toFixed(1)}vw`;

  const capped = Math.round(((MEASURE - 80) * drawn) / wide);

  return [
    `(min-width: ${MEASURE + 96}px) ${capped}px`,
    `(min-width: ${BREAK_WIDE}px) ${share(wide)}`,
    `(min-width: ${BREAK_MID}px) ${share(mid)}`,
    share(narrow),
  ].join(", ");
}

export function runLength(block: number, frames: number): number {
  return Math.ceil(frames / block) * block;
}
