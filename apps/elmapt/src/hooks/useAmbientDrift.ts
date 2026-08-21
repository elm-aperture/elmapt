import { useEffect } from "react";

/* Drifts the ambient field's three anchor points.
 *
 * The motion is a pair of summed sines per axis at deliberately unrelated
 * frequencies, so the loop never visibly repeats without needing a noise
 * table. Amplitude is small on purpose: the field should read as the room
 * lights shifting, not as an animation.
 *
 * Only custom properties are written, so this never touches layout — the
 * browser re-paints the gradients and nothing else. */

const ANCHORS = [
  { slot: 1, x: 84, y: 16 },
  { slot: 2, x: 14, y: 80 },
  { slot: 3, x: 74, y: 56 },
] as const;

/* percentage points of travel around each anchor */
const AMPLITUDE = 7;

/* angular speed of the slowest term: one pass every ~46s */
const BASE_SPEED = (2 * Math.PI) / 46_000;

/* pairwise non-harmonic multipliers, one per axis */
const RATIOS = [1, 0.61, 1.37, 0.83, 1.19, 0.47] as const;

const clampPercent = (value: number) =>
  value < 2 ? 2 : value > 98 ? 98 : value;

export function useAmbientDrift(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;

    /* random phase per load so two open tabs are never in lockstep */
    const phase = RATIOS.map(() => Math.random() * Math.PI * 2);

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const t = (now - started) * BASE_SPEED;

      for (let i = 0; i < ANCHORS.length; i += 1) {
        const anchor = ANCHORS[i];
        const xi = i * 2;
        const yi = i * 2 + 1;

        const x =
          anchor.x +
          AMPLITUDE *
            (0.68 * Math.sin(t * RATIOS[xi] + phase[xi]) +
              0.32 * Math.sin(t * RATIOS[xi] * 2.3 + phase[yi]));

        const y =
          anchor.y +
          AMPLITUDE *
            (0.68 * Math.cos(t * RATIOS[yi] + phase[yi]) +
              0.32 * Math.cos(t * RATIOS[yi] * 1.7 + phase[xi]));

        root.style.setProperty(
          `--elm-p${anchor.slot}x`,
          `${clampPercent(x).toFixed(2)}%`,
        );
        root.style.setProperty(
          `--elm-p${anchor.slot}y`,
          `${clampPercent(y).toFixed(2)}%`,
        );
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
}
