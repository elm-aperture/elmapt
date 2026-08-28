import { site } from "../site/site";
import "../styles/dock.css";

export function BookingDock({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={`dock${hidden ? " is-hidden" : ""}`}>
      <a
        className="dock__btn elm-btn"
        href={site.booking.href}
        aria-label={site.booking.label}
        tabIndex={hidden ? -1 : undefined}
        aria-hidden={hidden ? true : undefined}
      >
        <svg
          className="dock__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      </a>
    </div>
  );
}
