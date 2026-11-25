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
    <footer className="footer elm-surface" {...handle} data-sheet-handle>
      <button
        type="button"
        className="footer__grab"
        aria-expanded={expanded}
        onClick={(event) => {
          if (event.detail === 0) onToggle();
        }}
      >
        <svg
          className="footer__chev"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 15l6-6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="footer__line footer__line--lead elm-wordmark">
          About us
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
      </div>
    </footer>
  );
}
