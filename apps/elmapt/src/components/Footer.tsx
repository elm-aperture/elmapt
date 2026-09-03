import { site } from "../site/site";
import type { HandleProps } from "../hooks/useSheet";
import "../styles/footer.css";

export function Footer({
  handle,
  expanded,
  onToggle,
}: {
  handle: HandleProps;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <footer className="footer elm-surface" {...handle}>
      <button
        type="button"
        className="footer__grab"
        aria-expanded={expanded}
        onClick={(event) => {
          if (event.detail === 0) onToggle();
        }}
      >
        <span className="footer__line footer__line--place elm-eyebrow">
          Dallas - Fort Worth
        </span>
        <span className="footer__line footer__line--lead elm-wordmark">
          Photo<span className="footer__amp"> &amp; </span>Video
        </span>
      </button>

      <div className="footer__icons">
        <a
          className="footer__icon"
          href={site.instagram.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Elm Aperture on Instagram"
          draggable={false}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle
              cx="17.3"
              cy="6.7"
              r="0.9"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>

        <a
          className="footer__icon"
          href={site.youtube.href}
          aria-label="Elm Aperture on YouTube"
          draggable={false}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="4" />
            <path
              d="M10.5 9.5l5 2.5-5 2.5z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
