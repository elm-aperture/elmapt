import { useEffect, useRef, useState } from "react";

/* Flips an element to its revealed state the first time it enters the
 * viewport, then stops observing. One-shot on purpose: content that fades
 * back out on scroll-up is a novelty, not a reading experience.
 *
 * Where IntersectionObserver is missing the initial state is already
 * revealed, so nothing is ever hidden behind an API that will not arrive. */

export function useReveal<T extends HTMLElement>(
  rootMargin = "0px 0px -12% 0px",
) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, revealed]);

  return { ref, revealed };
}
