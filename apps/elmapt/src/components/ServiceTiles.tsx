import { memo } from "react";
import { categories } from "../gallery/manifest";
import { srcSetFor, thumbSrc } from "../gallery/sources";
import { useAfterLoad } from "../hooks/useAfterLoad";
import { useLoaded } from "../hooks/useLoaded";
import { pathToWork } from "../router/routes";
import type { Category } from "../gallery/types";
import "../styles/tiles.css";

// Three tiles across at every width, inside a column capped at 1240px.
const SIZES = "(min-width: 1416px) 400px, 31vw";

/** Which photo fronts each category's tile, by work and source frame, and
 * where to centre the crop. A category without a pick uses its first
 * work's cover. */
const PICKS: Readonly<
  Record<string, { work: string; source: number; focus: string }>
> = {
  realestate: { work: "hotel", source: 1, focus: "60% 50%" },
  portrait: { work: "professional", source: 1, focus: "50% 25%" },
  events: { work: "wedding", source: 20, focus: "55% 40%" },
};

function pickFor(category: Category) {
  const pick = PICKS[category.slug];
  const work =
    category.work.find((entry) => entry.slug === pick?.work) ??
    category.work[0];
  // The gallery addresses frames by display position; find the pick's.
  const at = pick ? (work.gallery.order?.indexOf(pick.source) ?? pick.source - 1) : -1;
  const frame = at >= 0 && at < work.gallery.count ? at + 1 : (work.cover ?? 1);
  return { gallery: work.gallery, frame, focus: pick?.focus };
}

function ServiceTile({ category, warm }: { category: Category; warm: boolean }) {
  const { loaded, capture, onLoad, onError } = useLoaded();
  const { gallery, frame, focus } = pickFor(category);

  return (
    <li className="tiles__item">
      <a className="tiles__link" href={`/${category.slug}`}>
        <span
          className={`elm-tile tiles__frame${loaded ? "" : " elm-skeleton"}`}
        >
          <img
            ref={capture}
            className={`elm-tile__img${loaded ? " is-loaded" : ""}`}
            src={warm ? thumbSrc(gallery, frame) : undefined}
            srcSet={warm ? srcSetFor(gallery, frame) : undefined}
            sizes={SIZES}
            style={focus ? { objectPosition: focus } : undefined}
            alt=""
            decoding="async"
            draggable={false}
            onLoad={onLoad}
            onError={onError}
          />
          <span className="tiles__name elm-label">{category.label}</span>
        </span>
      </a>
      <ul className="tiles__works">
        {category.work.map((work) => (
          <li key={work.slug}>
            <a href={pathToWork(category, work)}>
              {work.navLabel ?? work.title}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** One tile per category at the top of the About sheet: the obvious next
 * click for every kind of visitor. Covers load once the hero has. */
export const ServiceTiles = memo(function ServiceTiles() {
  const warm = useAfterLoad(".tiles");

  return (
    <ul className="tiles elm-container">
      {categories.map((category) => (
        <ServiceTile key={category.slug} category={category} warm={warm} />
      ))}
    </ul>
  );
});
