import { useEffect, useState } from "react";

const CEILING = 8000;

/** True once the page has loaded, every image already in it (bar those
 * inside `skip`) has finished, and the browser has gone idle: the moment to
 * start on work nobody is looking at yet. Images that join the page while
 * waiting (a carousel filling in its later frames) are waited for too. */
export function useAfterLoad(skip?: string): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    let finished = false;
    let idle = 0;
    let timer = 0;
    // A slow or stalled request shouldn't hold everything back forever.
    const ceiling = window.setTimeout(() => finish(), CEILING);
    const watched = new Set<HTMLImageElement>();

    const pending = () =>
      Array.from(document.images).filter(
        (image) =>
          !image.complete &&
          // A lazy image off screen may never load; don't wait on it.
          image.loading !== "lazy" &&
          !(skip && image.closest(skip)),
      );

    const finish = () => {
      if (!live || finished) return;
      finished = true;
      window.clearTimeout(ceiling);
      // Safari has no requestIdleCallback; a short timeout stands in.
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(() => live && setReady(true), {
          timeout: 1500,
        });
      } else {
        timer = window.setTimeout(() => live && setReady(true), 200);
      }
    };

    const check = () => {
      if (!live) return;
      const waiting = pending();
      if (waiting.length === 0) {
        // One more frame, so images mounted by the last load get counted.
        requestAnimationFrame(() => {
          if (pending().length === 0) finish();
          else check();
        });
        return;
      }
      for (const image of waiting) {
        if (watched.has(image)) continue;
        watched.add(image);
        image.addEventListener("load", check, { once: true });
        image.addEventListener("error", check, { once: true });
      }
    };

    if (document.readyState === "complete") check();
    else window.addEventListener("load", check, { once: true });

    return () => {
      live = false;
      window.removeEventListener("load", check);
      for (const image of watched) {
        image.removeEventListener("load", check);
        image.removeEventListener("error", check);
      }
      if (idle) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
      window.clearTimeout(ceiling);
    };
  }, [skip]);

  return ready;
}
