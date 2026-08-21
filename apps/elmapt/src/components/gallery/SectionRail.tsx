import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/rail.css";

type SectionRailProps = {
  sections: Readonly<Record<number, string>>;
};

/* how far down the viewport a heading counts as "the one being read" */
const READING_LINE = 140;

export function SectionRail({ sections }: SectionRailProps) {
  const entries = useMemo(
    () =>
      Object.entries(sections)
        .map(([frame, label]) => ({ frame: Number(frame), label }))
        .sort((a, b) => a.frame - b.frame),
    [sections],
  );

  const [active, setActive] = useState(() => entries[0]?.frame ?? 0);
  const [expanded, setExpanded] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    let queued = false;

    /* A dozen headings is cheap enough to measure directly, and reading the
     * positions beats inferring them from intersection ratios. */
    const measure = () => {
      queued = false;
      let current = entries[0].frame;

      for (const entry of entries) {
        const node = document.getElementById(`section-${entry.frame}`);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= READING_LINE) {
          current = entry.frame;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (target instanceof Node && mobileRef.current?.contains(target)) return;
      setExpanded(false);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  if (entries.length === 0) return null;

  const activeLabel = entries.find((entry) => entry.frame === active)?.label;

  const jump = (frame: number) => {
    setExpanded(false);
    document
      .getElementById(`section-${frame}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const item = (entry: { frame: number; label: string }) => (
    <button
      type="button"
      className={`rail__item${entry.frame === active ? " is-active" : ""}`}
      onClick={() => jump(entry.frame)}
      aria-current={entry.frame === active ? "true" : undefined}
    >
      {entry.label}
    </button>
  );

  return (
    <>
      <div className="rail__mobile" ref={mobileRef}>
        <button
          type="button"
          className="rail__marker elm-eyebrow elm-surface"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-label="Jump to a section"
        >
          <span>{activeLabel}</span>
          <span className="rail__chev" aria-hidden="true">
            &#9660;
          </span>
        </button>

        {expanded ? (
          <div className="rail__sheet elm-surface">
            {entries.map((entry) => (
              <div key={entry.frame}>{item(entry)}</div>
            ))}
          </div>
        ) : null}
      </div>

      <nav className="rail" aria-label="Sections">
        <ol className="rail__list">
          {entries.map((entry) => (
            <li key={entry.frame}>{item(entry)}</li>
          ))}
        </ol>
      </nav>
    </>
  );
}
