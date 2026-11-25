import type { CaseStudy, Gallery } from "../../gallery/types";
import { fullSrc, srcSetFor, thumbSrc } from "../../gallery/sources";
import "../../styles/study.css";

type CaseStudyCardProps = {
  study: CaseStudy;
  wall: Gallery;
  href: string;
};

export function CaseStudyCard({ study, wall, href }: CaseStudyCardProps) {
  const bricks = Array.from({ length: wall.count }, (_, index) => index + 1);

  return (
    <section className="studycard-wrap elm-section--tight">
      <a className="studycard elm-container" href={href}>
        <span className="studycard__stage">
          <span className="studycard__wall" aria-hidden="true">
            {bricks.map((frame) => (
              <img
                key={frame}
                className="studycard__brick"
                src={thumbSrc(wall, frame)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
          </span>

          <img
            className="studycard__feature"
            src={fullSrc(study.gallery, study.card.frame)}
            srcSet={srcSetFor(study.gallery, study.card.frame)}
            sizes="(min-width: 641px) min(62vw, 820px), 88vw"
            alt={study.name}
            loading="lazy"
            decoding="async"
            draggable={false}
          />

          <span className="studycard__title elm-surface">
            {study.card.label}
          </span>

          <span className="studycard__blurb elm-surface">
            {study.card.blurb}
          </span>
        </span>
      </a>
    </section>
  );
}
