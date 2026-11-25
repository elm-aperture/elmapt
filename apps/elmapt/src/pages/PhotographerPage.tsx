import { InstagramFeed } from "../components/InstagramFeed";
import { PageHeader } from "../components/PageHeader";
import { PersonLinks, PersonPortrait } from "../components/PersonParts";
import { pathToBookPerson } from "../router/routes";
import type { Person } from "../site/people";
import "../styles/work.css";
import "../styles/people.css";

const SIZES = [
  "(min-width: 1416px) 487px",
  "(min-width: 860px) 40vw",
  "92vw",
].join(", ");

export function PhotographerPage({ person }: { person: Person }) {
  return (
    <article className="person">
      <PageHeader eyebrow={person.role} title={person.name} />

      <div className="person__body elm-container">
        <PersonPortrait person={person} sizes={SIZES} />

        <div className="person__text">
          <p className="person__bio elm-body">{person.bio}</p>

          <PersonLinks person={person} />

          <a className="elm-btn person__book" href={pathToBookPerson(person)}>
            Book {person.name}
          </a>
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
