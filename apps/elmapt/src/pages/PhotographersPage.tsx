import type { CSSProperties } from "react";
import { PageHeader } from "../components/PageHeader";
import { useLoaded } from "../hooks/useLoaded";
import { pathToPerson } from "../router/routes";
import { people, srcSetFor } from "../site/people";
import type { Person } from "../site/people";
import "../styles/work.css";
import "../styles/people.css";

const CONTENT = 1240;
const GAP = 20;
const COLUMNS = 3;

const CARD = Math.round((CONTENT - (COLUMNS - 1) * GAP) / COLUMNS);

const SIZES = [
  `(min-width: 1416px) ${CARD}px`,
  `(min-width: 700px) ${Math.round(100 / COLUMNS)}vw`,
  "92vw",
].join(", ");

type PortraitVars = CSSProperties & {
  "--person-focus"?: string;
};

function Door({ person }: { person: Person }) {
  const { loaded, capture, onLoad, onError } = useLoaded();
  const { portrait } = person;

  return (
    <li className="chooser__item">
      <a className="chooser__link" href={pathToPerson(person)}>
        <span className="chooser__head">
          <span className="chooser__name elm-label">{person.name}</span>
          <span className="elm-rule" aria-hidden="true" />
          <span className="people__role elm-eyebrow">{person.role}</span>
        </span>

        <span
          className={`elm-tile elm-tile--link people__frame${loaded ? "" : " elm-skeleton"}`}
        >
          <img
            ref={capture}
            className={`elm-tile__img people__img${loaded ? " is-loaded" : ""}`}
            style={{ "--person-focus": portrait.focus } as PortraitVars}
            src={portrait.small.src}
            srcSet={srcSetFor(person)}
            sizes={SIZES}
            width={portrait.width}
            height={portrait.height}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={onLoad}
            onError={onError}
          />
        </span>
      </a>
    </li>
  );
}

type ChooserVars = CSSProperties & {
  "--chooser-cols"?: number;
};

export function PhotographersPage() {
  const style: ChooserVars = { "--chooser-cols": COLUMNS };

  return (
    <article className="category">
      <PageHeader title="Photographers" />

      <ul className="chooser elm-container" style={style}>
        {people.map((person) => (
          <Door key={person.slug} person={person} />
        ))}
      </ul>
    </article>
  );
}
