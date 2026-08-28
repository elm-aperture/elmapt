import { site } from "../site/site";
import "../styles/footer.css";

export function Footer({ floating = false }: { floating?: boolean }) {
  return (
    <footer className={`footer${floating ? " footer--floating" : ""}`}>
      <div className="footer__icons">
        <a
          className="footer__icon"
          href={site.instagram.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Elm Aperture on Instagram"
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
            <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </a>

        {/* No channel live yet — href is "#" on purpose until there's
            somewhere real to send it. */}
        <a
          className="footer__icon"
          href={site.youtube.href}
          aria-label="Elm Aperture on YouTube"
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
            <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
