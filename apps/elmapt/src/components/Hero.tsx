import { useCallback, useEffect } from "react";
import type { CSSProperties } from "react";
import { site } from "../site/site";
import { useCarousel } from "../hooks/useCarousel";
import "../styles/hero.css";

type FrameVars = CSSProperties & {
  "--hero-backdrop"?: string;
};

type ImageVars = CSSProperties & {
  "--hero-focus"?: string;
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
      style={{ "--hero-focus": frame.focus } as ImageVars}
      src={frame.src}
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
      className="hero"
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
    </section>
  );
}
