import { memo } from "react";
import {
  pathToBookPerson,
  pathToPeople,
  pathToPerson,
} from "../router/routes";
import { people } from "../site/people";
import { PersonLinks, PersonPortrait } from "./PersonParts";
import { useAfterLoad } from "../hooks/useAfterLoad";
import "../styles/bands.css";

const SIZES = [
  "(min-width: 1416px) 520px",
  "(min-width: 860px) 40vw",
  "92vw",
].join(", ");

/** The photographers as full-width segments down the home page, alternating
 * sides. /photographers stays the dedicated index. */
/* Memoised: the home page re-renders on every wheel event while the sheet
 * moves, and this has no props, so it never needs to follow. */
export const PeopleBands = memo(function PeopleBands() {
  /* The bands sit in the closed About sheet, just below the fold, close
   * enough that native lazy loading would fetch them at once and compete
   * with the hero. Hold them back until everything visible has loaded, then
   * fetch them so they are ready before anyone scrolls there. */
  const warm = useAfterLoad(".bands");

  return (
    <section className="bands" aria-labelledby="bands-title">
      <header className="bands__head elm-container">
        <h2 id="bands-title" className="bands__title elm-eyebrow">
          <a href={pathToPeople()}>Photographers</a>
        </h2>
      </header>

      {people.map((person, index) => (
        <article
          key={person.slug}
          className={`band${index % 2 === 1 ? " band--flip" : ""}`}
        >
          <div className="band__body elm-container">
            <PersonPortrait
              person={person}
              sizes={SIZES}
              className="band__frame"
              hold={!warm}
            />

            <div className="band__text">
              <p className="band__role elm-eyebrow">{person.role}</p>
              <h3 className="band__name elm-display">
                <a href={pathToPerson(person)}>{person.name}</a>
              </h3>
              <p className="band__bio elm-body">{person.bio}</p>

              <PersonLinks person={person} />

              <div className="band__actions">
                <a className="elm-btn" href={pathToBookPerson(person)}>
                  Book {person.name}
                </a>
                <a
                  className="elm-btn elm-btn--ghost"
                  href={pathToPerson(person)}
                >
                  More from {person.name}
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
});
