import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { Gallery } from "../../gallery/types";
import { runLength, spanFor } from "../../gallery/mosaic";
import { OpenFrame, Tile } from "./Tile";
import "../../styles/gallery.css";

type MosaicVars = CSSProperties & {
  "--elm-mosaic-ratio"?: number;
  "--cols-wide"?: number;
  "--cols-mid"?: number;
  "--cols-narrow"?: number;
};

type MosaicProps = {
  gallery: Gallery;
  /* 1-based frames to render; defaults to the whole set */
  frames?: readonly number[];
  /* sparse frame -> label; each label starts a new run */
  sections?: Readonly<Record<number, string>>;
  onOpen?: (frame: number) => void;
  linkFor?: (frame: number) => string;
  /* leading frames that skip lazy-loading; roughly the first row */
  eagerCount?: number;
  /* skip render work for offscreen cells — for sets in the hundreds */
  deferred?: boolean;
};

type Run = {
  readonly key: string;
  readonly label?: string;
  readonly frames: readonly number[];
};

export function Mosaic({
  gallery,
  frames,
  sections,
  onOpen,
  linkFor,
  eagerCount = 4,
  deferred = false,
}: MosaicProps) {
  const list = useMemo(
    () =>
      frames ?? Array.from({ length: gallery.count }, (_, index) => index + 1),
    [frames, gallery.count],
  );

  const runs = useMemo<readonly Run[]>(() => {
    if (!sections) return [{ key: "all", frames: list }];

    const out: { key: string; label?: string; frames: number[] }[] = [];

    for (const frame of list) {
      const label = sections[frame];
      if (label || out.length === 0) {
        out.push({ key: `run-${frame}`, label, frames: [] });
      }
      out[out.length - 1].frames.push(frame);
    }

    return out;
  }, [list, sections]);

  const [wide, mid, narrow] = gallery.cols;

  const style: MosaicVars = {
    "--elm-mosaic-ratio": gallery.ratio,
    "--cols-wide": wide,
    "--cols-mid": mid,
    "--cols-narrow": narrow,
  };

  let position = 0;

  return (
    <div className="elm-mosaic-frame">
      {runs.map((run) => {
        const heading = run.label ? (
          <h3 className="mosaic__section" id={`section-${run.frames[0]}`}>
            {run.label}
          </h3>
        ) : null;

        const cells = run.frames.map((frame) => {
          const eager = position < eagerCount;
          position += 1;

          return (
            <Tile
              key={frame}
              gallery={gallery}
              frame={frame}
              plate={gallery.plates?.[frame - 1]}
              href={linkFor?.(frame)}
              onOpen={onOpen}
              eager={eager}
              deferred={deferred && !eager}
            />
          );
        });

        /* The positions between the last photograph and the end of the block.
         * Numbering carries on from the run so a hero slot keeps its width. */
        const last = run.frames[run.frames.length - 1] ?? 0;
        const openCount = runLength(gallery.block, run.frames.length) - run.frames.length;

        return (
          <section className="mosaic__run" key={run.key}>
            {heading}
            <div className="elm-mosaic mosaic" style={style}>
              {cells}
              {Array.from({ length: openCount }, (_, index) => {
                const at = last + index + 1;
                return <OpenFrame key={`open-${at}`} span={spanFor(gallery, at)} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
