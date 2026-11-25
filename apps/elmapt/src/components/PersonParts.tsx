import type { CSSProperties } from "react";
import { useLoaded } from "../hooks/useLoaded";
import { srcSetFor } from "../site/people";
import type { Person } from "../site/people";
import "../styles/people.css";

type PortraitVars = CSSProperties & {
  "--person-focus"?: string;
};

const leavesTheSite = (href: string) => !/^(mailto|tel):/.test(href);

/** A photographer's portrait, shimmer until it lands. Shared by the
 * photographer page and the home page's photographer bands. */
export function PersonPortrait({
  person,
  sizes,
  className = "",
  loading,
  hold = false,
}: {
  person: Person;
  sizes: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Render the frame without a source, so nothing downloads yet. */
  hold?: boolean;
}) {
  const { loaded, capture, onLoad, onError } = useLoaded();
  const { portrait } = person;

  return (
    <figure
      className={`elm-tile person__frame ${className}${loaded ? "" : " elm-skeleton"}`}
    >
      <img
        ref={capture}
        className={`elm-tile__img people__img${loaded ? " is-loaded" : ""}`}
        style={{ "--person-focus": portrait.focus } as PortraitVars}
        src={hold ? undefined : portrait.full.src}
        srcSet={hold ? undefined : srcSetFor(person)}
        sizes={sizes}
        width={portrait.width}
        height={portrait.height}
        alt={portrait.alt}
        loading={loading}
        decoding="async"
        draggable={false}
        onLoad={onLoad}
        onError={onError}
      />
    </figure>
  );
}

export function PersonLinks({ person }: { person: Person }) {
  return (
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
  );
}
