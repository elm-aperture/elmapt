import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const HOLD = 11250;

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
  current: number;

  previous: number | null;

  armed: boolean;

  settled: ReadonlySet<number>;
  settle: (index: number) => void;

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

  const armed = settled.has(0);

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
