import type { CSSProperties } from "react";
import { InstagramFeed } from "../components/InstagramFeed";
import { PageHeader } from "../components/PageHeader";
import { useLoaded } from "../hooks/useLoaded";
import { srcSetFor } from "../site/people";
import type { Person } from "../site/people";
import "../styles/work.css";
import "../styles/people.css";

const SIZES = [
  "(min-width: 1416px) 487px",
  "(min-width: 860px) 40vw",
  "92vw",
].join(", ");

type PortraitVars = CSSProperties & {
  "--person-focus"?: string;
};

const leavesTheSite = (href: string) => !/^(mailto|tel):/.test(href);

export function PhotographerPage({ person }: { person: Person }) {
  const { loaded, capture, onLoad, onError } = useLoaded();
  const { portrait } = person;

  return (
    <article className="person">
      <PageHeader eyebrow={person.role} title={person.name} />

      <div className="person__body elm-container">
        <figure
          className={`elm-tile person__frame${loaded ? "" : " elm-skeleton"}`}
        >
          <img
            ref={capture}
            className={`elm-tile__img people__img${loaded ? " is-loaded" : ""}`}
            style={{ "--person-focus": portrait.focus } as PortraitVars}
            src={portrait.full.src}
            srcSet={srcSetFor(person)}
            sizes={SIZES}
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt}
            decoding="async"
            draggable={false}
            onLoad={onLoad}
            onError={onError}
          />
        </figure>

        <div className="person__text">
          <p className="person__bio elm-body">{person.bio}</p>

          <ul className="person__links">
            {person.links.map((link) => (
              <li key={link.href}>
                <a
                  className="person__link"
                  href={link.href}
                  target={leavesTheSite(link.href) ? "_blank" : undefined}
                  rel={leavesTheSite(link.href) ? "noreferrer" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {person.feed ? (
        <InstagramFeed
          feedId={person.feed}
          eyebrow="Featured shots on Instagram"
        />
      ) : null}
    </article>
  );
}
