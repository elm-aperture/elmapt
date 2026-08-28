import { useCallback, useState } from "react";
import type { CSSProperties } from "react";
import { site } from "../site/site";
import "../styles/hero.css";

type FrameVars = CSSProperties & {
  "--hero-backdrop"?: string;
};

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  /* A cached image can finish before React attaches onLoad, which would
   * strand the fade at zero. Check the element the moment we get it. */
  const captureImage = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <section className="hero" aria-label={site.name}>
      <div
        className="hero__frame"
        style={{ "--hero-backdrop": site.hero.backdrop } as FrameVars}
      >
        <img
          ref={captureImage}
          className={`hero__img${loaded ? " is-in" : ""}`}
          src={site.hero.src}
          alt={site.hero.alt}
          width={site.hero.width}
          height={site.hero.height}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </section>
  );
}
