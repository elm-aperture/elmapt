import { SectionHead } from "./SectionHead";
import type { Figure, Prose as ProseBlock } from "../gallery/types";

export function ProseSection({ heading, body }: ProseBlock) {
  return (
    <section className="prose elm-section--tight">
      <div className="elm-container elm-center">
        <SectionHead>{heading}</SectionHead>
        <p className="prose__body elm-body">{body}</p>
      </div>
    </section>
  );
}

export function FigureSection({ heading, src, alt }: Figure) {
  return (
    <section className="figure elm-section--tight">
      <div className="elm-container elm-center">
        <SectionHead>{heading}</SectionHead>
        <img
          className="figure__img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
