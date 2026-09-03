import { PageHeader } from "../components/PageHeader";
import { Mosaic } from "../components/gallery/Mosaic";
import { Lightbox } from "../components/gallery/Lightbox";
import { CaseStudyCard } from "../components/gallery/CaseStudyCard";
import { FigureSection, ProseSection } from "../components/Prose";
import { useLightbox } from "../hooks/useLightbox";
import { useScrollLock } from "../hooks/useScrollLock";
import { pathToStudy } from "../router/routes";
import { NO_FRAMES } from "../gallery/manifest";
import type { Category, Work } from "../gallery/types";
import "../styles/work.css";

export function WorkPage({
  category,
  work,
}: {
  category: Category;
  work: Work;
}) {
  const { frame, open, close, step } = useLightbox(work.gallery.count);
  useScrollLock(frame !== null);

  const [lead, ...rest] = work.prose ?? [];

  return (
    <article className="work">
      <PageHeader
        eyebrow={category.label}
        title={work.title}
        subtitle={work.subtitle}
      />

      {work.gallery.count === 0 ? (
        <p className="work__holding elm-container elm-lede">{NO_FRAMES}.</p>
      ) : (
        <div className="work__set elm-container">
          <Mosaic gallery={work.gallery} onOpen={open} />
        </div>
      )}

      {lead ? <ProseSection {...lead} /> : null}

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

      {work.gallery.count === 0 ? null : (
        <Lightbox
          gallery={work.gallery}
          frame={frame}
          onClose={close}
          onStep={step}
        />
      )}
    </article>
  );
}
