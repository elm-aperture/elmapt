import { Mosaic } from "../components/gallery/Mosaic";
import { Lightbox } from "../components/gallery/Lightbox";
import { SectionRail } from "../components/gallery/SectionRail";
import { useLightbox } from "../hooks/useLightbox";
import { useScrollLock } from "../hooks/useScrollLock";
import { pathToWork } from "../router/routes";
import type { CaseStudy, Category, Work } from "../gallery/types";
import "../styles/study.css";

type CaseStudyPageProps = {
  category: Category;
  work: Work;
  study: CaseStudy;
};

export function CaseStudyPage({ category, work, study }: CaseStudyPageProps) {
  const { frame, open, close, step } = useLightbox(study.gallery.count);
  useScrollLock(frame !== null);

  return (
    <article className="study">
      <header className="study__head elm-container">
        <a
          className="study__back elm-navlink"
          href={pathToWork(category, work)}
        >
          &#8249; {work.title}
        </a>
        <h1 className="study__title elm-display">{study.name}</h1>
        <p className="study__line elm-body">{study.line}</p>
        <p className="study__count elm-eyebrow elm-tnum">
          {study.gallery.count} frames delivered
        </p>
      </header>

      <SectionRail sections={study.sections} />

      <div className="study__set elm-container">
        <Mosaic
          gallery={study.gallery}
          sections={study.sections}
          onOpen={open}
          deferred
          ragged
        />
      </div>

      <Lightbox
        gallery={study.gallery}
        frame={frame}
        onClose={close}
        onStep={step}
      />
    </article>
  );
}
