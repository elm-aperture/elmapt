import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { UNATTRIBUTED } from "../../gallery/types";
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

  frames?: readonly number[];

  sections?: Readonly<Record<number, string>>;
  onOpen?: (frame: number) => void;
  linkFor?: (frame: number) => string;

  eagerCount?: number;

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

  const filler = useMemo(() => {
    const plates = gallery.plates;
    if (!plates) return null;
    const held = new Set(
      list.filter((f) => plates[f - 1]?.by === UNATTRIBUTED),
    );
    return held.size > 0 && held.size < list.length ? held : null;
  }, [list, gallery.plates]);

  const realCount = filler ? list.length - filler.size : 0;
  const [settledReal, setSettledReal] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const onSettled = useCallback(
    (frame: number) => {
      if (!filler || filler.has(frame)) return;
      setSettledReal((done) =>
        done.has(frame) ? done : new Set(done).add(frame),
      );
    },
    [filler],
  );

  const holding = filler !== null && settledReal.size < realCount;

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
              key={`${gallery.id}-${frame}`}
              gallery={gallery}
              frame={frame}
              plate={gallery.plates?.[frame - 1]}
              href={linkFor?.(frame)}
              onOpen={onOpen}
              eager={eager}
              deferred={deferred && !eager}
              hold={holding && (filler?.has(frame) ?? false)}
              onSettled={onSettled}
            />
          );
        });

        const last = run.frames[run.frames.length - 1] ?? 0;
        const openCount =
          runLength(gallery.block, run.frames.length) - run.frames.length;

        return (
          <section className="mosaic__run" key={run.key}>
            {heading}
            <div className="elm-mosaic mosaic" style={style}>
              {cells}
              {Array.from({ length: openCount }, (_, index) => {
                const at = last + index + 1;
                return (
                  <OpenFrame
                    key={`${gallery.id}-open-${at}`}
                    span={spanFor(gallery, at)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
