import { useEffect, useRef } from "react";
import { BookingForm } from "../components/BookingForm";
import { GalleryCta } from "../components/GalleryCta";
import { PageHeader } from "../components/PageHeader";
import { FigureSection, ProseSection } from "../components/Prose";
import { SectionHead } from "../components/SectionHead";
import { CaseStudyCard } from "../components/gallery/CaseStudyCard";
import { Lightbox } from "../components/gallery/Lightbox";
import { Mosaic } from "../components/gallery/Mosaic";
import { useLightbox } from "../hooks/useLightbox";
import { useScrollLock } from "../hooks/useScrollLock";
import { pathToStudy } from "../router/routes";
import { useLocation } from "../router/useRoute";
import type { Category, Work } from "../gallery/types";
import type { Landing } from "../site/landings";
import { site } from "../site/site";
import "../styles/work.css";
import "../styles/landing.css";

const FORM = "#book";

function Section({
  category,
  work,
  lead,
}: {
  category: Category;
  work: Work;
  lead: boolean;
}) {
  // Several galleries share the page, so each viewer gets its own hash key.
  const { frame, open, close, step } = useLightbox(work.gallery.count, work.slug);
  useScrollLock(frame !== null);
  const [first, ...rest] = work.prose ?? [];

  return (
    <section className="landing__section">
      {lead ? null : (
        <div className="landing__head elm-container">
          <SectionHead>{work.title}</SectionHead>
          <p className="landing__sub elm-body">{work.subtitle}</p>
        </div>
      )}

      <div className="work__set elm-container">
        <Mosaic gallery={work.gallery} onOpen={open} />
      </div>

      <GalleryCta href={FORM} />

      {first ? <ProseSection {...first} /> : null}

      {work.caseStudy ? (
        <CaseStudyCard
          study={work.caseStudy}
          wall={work.gallery}
          href={pathToStudy(category, work, work.caseStudy)}
        />
      ) : null}

      {work.figure ? <FigureSection {...work.figure} /> : null}

      {rest.map((block) => (
        <ProseSection key={block.heading} {...block} />
      ))}

      <Lightbox
        gallery={work.gallery}
        frame={frame}
        onClose={close}
        onStep={step}
      />
    </section>
  );
}

export function LandingPage({
  landing,
  sections,
}: {
  landing: Landing;
  sections: readonly { category: Category; work: Work }[];
}) {
  const form = useRef<HTMLElement>(null);
  const { hash } = useLocation();
  const [lead] = sections;

  // Every "book" link on the page points at #book; bring the form into view.
  useEffect(() => {
    if (hash !== FORM) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.current?.scrollIntoView({ behavior: still ? "auto" : "smooth" });
  }, [hash]);

  return (
    <article className="landing">
      <PageHeader
        eyebrow={landing.audience}
        title={lead.work.title}
        subtitle={lead.work.subtitle}
      />

      <p className="landing__top elm-container">
        <a className="elm-btn" href={FORM}>
          {site.booking.label}
        </a>
      </p>

      {sections.map(({ category, work }, index) => (
        <Section
          key={work.slug}
          category={category}
          work={work}
          lead={index === 0}
        />
      ))}

      <section ref={form} id="book" className="landing__book">
        <div className="elm-container">
          <SectionHead>{site.booking.label}</SectionHead>
        </div>
        <BookingForm kind={lead.work.title} />
      </section>
    </article>
  );
}
