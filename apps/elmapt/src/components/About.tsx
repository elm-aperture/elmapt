import { memo } from "react";
import { SectionHead } from "./SectionHead";
import { pathToBooking } from "../router/routes";
import { faq, statement, stats, steps } from "../site/about";
import { site } from "../site/site";
import "../styles/about.css";

/* The About section on the home page, in the order a visitor's doubts come
 * up: who are you, how much have you done, how does it work, (photographers),
 * what about the details, and then the ask. Each part is memoised: the home
 * page re-renders on every wheel event while the sheet moves, and none of
 * these take props. */

export const About = memo(function About() {
  return (
    <>
      {statement.map((line) => (
        <p key={line} className="about__lede elm-body">
          {line}
        </p>
      ))}
    </>
  );
});

export const AboutStats = memo(function AboutStats() {
  return (
    <ul className="about__stats elm-container">
      {stats.map((stat) => (
        <li key={stat.label} className="about__stat">
          <span className="about__figure elm-display elm-tnum">
            {stat.figure}
          </span>
          <span className="about__label elm-eyebrow">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
});

export const AboutProcess = memo(function AboutProcess() {
  return (
    <section className="about__process elm-container">
      <SectionHead>How it works</SectionHead>
      <ol className="about__steps">
        {steps.map((step, index) => (
          <li key={step.title} className="about__step">
            <span className="about__num elm-tnum">{index + 1}</span>
            <h3 className="about__steptitle elm-label">{step.title}</h3>
            <p className="about__stepbody elm-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
});

export const AboutFaq = memo(function AboutFaq() {
  return (
    <section className="about__faq elm-container">
      <SectionHead>Questions</SectionHead>
      <div className="about__qs">
        {faq.map((item) => (
          <details key={item.q} className="about__q">
            <summary>{item.q}</summary>
            <p className="elm-body">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
});

export const AboutClose = memo(function AboutClose() {
  return (
    <section className="about__close elm-container">
      <a className="elm-btn" href={pathToBooking()}>
        {site.booking.label}
      </a>
      <p className="about__reach">
        Prefer to talk? Call or text{" "}
        <a href={`tel:${site.contact.tel}`}>{site.contact.phone}</a>
      </p>
    </section>
  );
});
