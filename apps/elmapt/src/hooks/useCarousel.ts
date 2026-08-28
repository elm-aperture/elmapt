import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/* The homepage carousel's clock, and nothing else — what a frame looks like
 * while it arrives and leaves is entirely hero.css.
 *
 * HOLD is the gap between handovers, not the time a frame is legible: the
 * dissolve eats into it from the front. It must stay comfortably longer than
 * --hero-dissolve, or a frame would begin leaving before it had finished
 * arriving. */
const HOLD = 9000;

const REDUCE = "(prefers-reduced-motion: reduce)";

let reduceQuery: MediaQueryList | null = null;
const reduceMotion = () => (reduceQuery ??= window.matchMedia(REDUCE));

function subscribeMotion(changed: () => void) {
  const query = reduceMotion();
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
}

const stillSnapshot = () => reduceMotion().matches;

function subscribeVisibility(changed: () => void) {
  document.addEventListener("visibilitychange", changed);
  return () => document.removeEventListener("visibilitychange", changed);
}

const visibleSnapshot = () => !document.hidden;

export type Carousel = {
  /* The frame that should be on screen. */
  current: number;
  /* The frame it is replacing, held at full strength underneath it so the
   * handover is a dissolve between two photographs rather than a dip to the
   * backdrop. Null until the first handover. */
  previous: number | null;
  /* True once the first frame has arrived — the cue to request the rest. */
  armed: boolean;
  /* Every frame that has finished, successfully or not. A frame that 404s
   * still counts: one missing file should cost its own turn, not the whole
   * rotation. */
  settled: ReadonlySet<number>;
  settle: (index: number) => void;
  /* Manual step, for the on-screen chevrons. Wraps at either end and resets
   * the auto-advance clock, so a reader who just clicked isn't immediately
   * interrupted by the timer catching up. */
  step: (delta: 1 | -1) => void;
};

export function useCarousel(count: number): Carousel {
  const [settled, setSettled] = useState<ReadonlySet<number>>(
    () => new Set<number>(),
  );
  const [at, setAt] = useState<{ current: number; previous: number | null }>({
    current: 0,
    previous: null,
  });

  const settle = useCallback((index: number) => {
    setSettled((done) => (done.has(index) ? done : new Set(done).add(index)));
  }, []);

  /* Both of these answer "assume the quietest reading" before the browser
   * has been asked, so nothing is ever scheduled on a guess. */
  const still = useSyncExternalStore(
    subscribeMotion,
    stillSnapshot,
    () => true,
  );
  const visible = useSyncExternalStore(
    subscribeVisibility,
    visibleSnapshot,
    () => false,
  );

  /* The first frame is the largest thing the homepage paints, so it competes
   * with nothing: the other four are not requested until it has landed. */
  const armed = settled.has(0);

  /* And nothing rotates until all of them are decoded, because advancing to
   * a frame that has not arrived shows a hole where a photograph should be. */
  const ready = settled.size >= count;

  useEffect(() => {
    if (!ready || still || !visible || count < 2) return;

    const timer = window.setInterval(() => {
      setAt(({ current }) => ({
        current: (current + 1) % count,
        previous: current,
      }));
    }, HOLD);

    return () => window.clearInterval(timer);
    /* at.current is a dependency on purpose: any change to it — the timer's
     * own tick or a manual step — restarts the clock, so a click always
     * buys a full HOLD before the next automatic advance. */
  }, [ready, still, visible, count, at.current]);

  const step = useCallback(
    (delta: 1 | -1) => {
      setAt(({ current }) => ({
        current: (current + delta + count) % count,
        previous: current,
      }));
    },
    [count],
  );

  return {
    current: at.current,
    previous: at.previous,
    armed,
    settled,
    settle,
    step,
  };
}
