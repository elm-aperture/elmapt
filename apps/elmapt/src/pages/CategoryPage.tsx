import type { CSSProperties } from "react";
import { PageHeader } from "../components/PageHeader";
import { useLoaded } from "../hooks/useLoaded";
import { pathToWork } from "../router/routes";
import { intrinsic, srcSetFor, thumbSrc } from "../gallery/sources";
import { NO_FRAMES } from "../gallery/manifest";
import type { Category, Work } from "../gallery/types";
import "../styles/work.css";

const CONTENT = 1240;
const GAP = 20;

function columnsFor(count: number, upright: boolean): number {
  const widest = upright ? 4 : 3;
  for (let columns = widest; columns >= 2; columns -= 1) {
    if (count % columns === 0) return columns;
  }
  return upright ? 3 : 2;
}

function cardSizes(columns: number): string {
  const capped = Math.round((CONTENT - (columns - 1) * GAP) / columns);
  return [
    `(min-width: 1416px) ${capped}px`,
    `(min-width: 700px) ${Math.round(100 / columns)}vw`,
    "92vw",
  ].join(", ");
}

type FrameVars = CSSProperties & {
  aspectRatio?: number;
};

function Door({
  category,
  work,
  columns,
}: {
  category: Category;
  work: Work;
  columns: number;
}) {
  const { loaded, capture, onLoad, onError } = useLoaded();
  const frame = work.cover ?? 1;
  const box = intrinsic(work.gallery);
  const frameStyle: FrameVars = { aspectRatio: work.gallery.ratio };
  const empty = work.gallery.count === 0;

  return (
    <li className="chooser__item">
      <a className="chooser__link" href={pathToWork(category, work)}>
        <span className="chooser__head">
          <span className="chooser__name elm-label">{work.title}</span>
          <span className="elm-rule" aria-hidden="true" />
          {empty ? null : (
            <span className="chooser__count elm-eyebrow elm-tnum">
              {work.gallery.count}
            </span>
          )}
        </span>

        <span
          className={`elm-tile elm-tile--link chooser__frame${empty ? " chooser__frame--empty" : ""}${loaded || empty ? "" : " elm-skeleton"}`}
          style={frameStyle}
        >
          {empty ? (
            <span className="chooser__empty elm-eyebrow">{NO_FRAMES}</span>
          ) : (
            <img
              ref={capture}
              className={`elm-tile__img${loaded ? " is-loaded" : ""}`}
              src={thumbSrc(work.gallery, frame)}
              srcSet={srcSetFor(work.gallery, frame)}
              sizes={cardSizes(columns)}
              width={box.width}
              height={box.height}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={onLoad}
              onError={onError}
            />
          )}
        </span>
      </a>
    </li>
  );
}

type ChooserVars = CSSProperties & {
  "--chooser-cols"?: number;
};

export function CategoryPage({ category }: { category: Category }) {
  const upright = (category.work[0]?.gallery.ratio ?? 1.5) < 1;
  const columns = columnsFor(category.work.length, upright);
  const style: ChooserVars = { "--chooser-cols": columns };

  return (
    <article className="category">
      <PageHeader title={category.label} />

      <ul className="chooser elm-container" style={style}>
        {category.work.map((work) => (
          <Door
            key={work.slug}
            category={category}
            work={work}
            columns={columns}
          />
        ))}
      </ul>
    </article>
  );
}
