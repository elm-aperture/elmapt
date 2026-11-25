import { PageHeader } from "../components/PageHeader";
import { privacy } from "../site/privacy";
import { site } from "../site/site";
import "../styles/work.css";

export function PrivacyPage() {
  return (
    <article className="privacy">
      <PageHeader
        title="Privacy"
        subtitle={`Last updated ${privacy.updated}`}
      />
      <div className="privacy__body elm-container">
        {privacy.sections.map((section) => (
          <section key={section.heading} className="privacy__section">
            <h2 className="privacy__head elm-label">{section.heading}</h2>
            {section.body.map((line) => (
              <p key={line} className="elm-body">
                {line}
              </p>
            ))}
          </section>
        ))}
        <p className="elm-body">
          Questions? Email{" "}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      </div>
    </article>
  );
}
