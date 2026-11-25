import { useCallback, useEffect } from "react";
import type { CSSProperties } from "react";
import { site } from "../site/site";
import { useCarousel } from "../hooks/useCarousel";
import "../styles/hero.css";

/* `focus` is "x% y%": x is the subject's centre across the frame, y the
 * object-position used when top and bottom are cropped. */
const heroFocus = (focus: string): ImageVars => {
  const [x = "50%", y = "50%"] = focus.split(" ");
  return { "--hero-fx": parseFloat(x) / 100, "--hero-fy": y } as ImageVars;
};

/* Publishes the hero's width and the width a 3:2 frame covers it at, so
 * CSS can centre each frame's subject when the sides are cropped. */
const ASPECT = site.hero.width / site.hero.height;

const measureCover = (node: HTMLElement | null) => {
  if (!node) return;
  const observer = new ResizeObserver(() => {
    const { width, height } = node.getBoundingClientRect();
    node.style.setProperty("--hero-bw", `${width}px`);
    node.style.setProperty("--hero-iw", `${Math.max(width, height * ASPECT)}px`);
  });
  observer.observe(node);
  return () => observer.disconnect();
};

/* Carousel frames ship at 960, 1440 and 1920 wide (the 1920 is the bare name). */
const heroSrcSet = (src: string) =>
  `${src.replace(/\.webp$/, "_960.webp")} 960w, ${src.replace(/\.webp$/, "_1440.webp")} 1440w, ${src} 1920w`;


type FrameVars = CSSProperties & {
  "--hero-backdrop"?: string;
};

type ImageVars = CSSProperties & {
  "--hero-fx"?: number;
  "--hero-fy"?: string;
};

const frames = site.hero.frames;

type Layer = "in" | "under" | "out";

type FrameProps = {
  frame: (typeof frames)[number];
  index: number;
  layer: Layer;
  lead: boolean;

  debut: boolean;
  settle: (index: number) => void;
};

function HeroFrame({ frame, index, layer, lead, debut, settle }: FrameProps) {
  const capture = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete) settle(index);
    },
    [index, settle],
  );

  return (
    <img
      ref={capture}
      className={`hero__img hero__img--${layer}${debut ? " hero__img--debut" : ""}`}
      style={heroFocus(frame.focus)}
      src={frame.src}
      srcSet={heroSrcSet(frame.src)}
      sizes="100vw"
      alt={frame.alt}
      width={site.hero.width}
      height={site.hero.height}
      fetchPriority={lead ? "high" : "low"}
      loading="eager"
      decoding="async"
      draggable={false}
      onLoad={() => settle(index)}
      onError={() => settle(index)}
    />
  );
}

function HeroChevron({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`hero__nav hero__nav--${direction}`}
      onClick={onClick}
      aria-label={
        direction === "prev" ? "Previous photograph" : "Next photograph"
      }
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path d="M15 5l-7 7 7 7" />
        ) : (
          <path d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export function Hero() {
  const { current, previous, armed, settled, settle, step } = useCarousel(
    frames.length,
  );

  const canNavigate = armed && frames.length > 1;

  useEffect(() => {
    if (!canNavigate) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canNavigate, step]);

  return (
    <section
      ref={measureCover}
      className={`hero${armed ? "" : " elm-skeleton"}`}
      aria-label={site.name}
      style={{ "--hero-backdrop": site.hero.backdrop } as FrameVars}
    >
      {frames.map((frame, index) => {
        if (index !== 0 && !armed) return null;

        const layer: Layer =
          index === current && settled.has(index)
            ? "in"
            : index === previous
              ? "under"
              : "out";

        return (
          <HeroFrame
            key={frame.src}
            frame={frame}
            index={index}
            layer={layer}
            lead={index === 0}
            debut={layer === "in" && previous === null}
            settle={settle}
          />
        );
      })}

      {canNavigate && (
        <>
          <HeroChevron direction="prev" onClick={() => step(-1)} />
          <HeroChevron direction="next" onClick={() => step(1)} />
        </>
      )}

      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__cta">
        <h1 className="hero__title elm-display">{site.headline.title}</h1>
        <p className="hero__line">{site.headline.line}</p>

        <div className="hero__actions">
          <a className="elm-btn hero__book" href={site.booking.href}>
            {site.booking.label}
          </a>
        </div>

        <p className="hero__call">
          Or call or text{" "}
          <a href={`tel:${site.contact.tel}`}>{site.contact.phone}</a>
        </p>
      </div>
    </section>
  );
}
