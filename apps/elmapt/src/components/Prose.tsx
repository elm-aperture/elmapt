import { SectionHead } from "./SectionHead";
import type { Figure, Prose as ProseBlock } from "../gallery/types";

function LinkedText({ body, link }: Pick<ProseBlock, "body" | "link">) {
  const at = link ? body.indexOf(link.text) : -1;
  if (!link || at === -1) return body;
  return (
    <>
      {body.slice(0, at)}
      <a className="prose__link" href={link.href}>
        {link.text}
      </a>
      {body.slice(at + link.text.length)}
    </>
  );
}

export function ProseSection({ heading, body, link }: ProseBlock) {
  return (
    <section className="prose elm-section--tight">
      <div className="elm-container elm-center">
        <SectionHead>{heading}</SectionHead>
        <p className="prose__body elm-body">
          <LinkedText body={body} link={link} />
        </p>
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
