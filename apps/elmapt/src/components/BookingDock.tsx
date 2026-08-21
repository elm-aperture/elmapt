import { site } from "../site/site";
import "../styles/dock.css";

export function BookingDock({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={`dock${hidden ? " is-hidden" : ""}`}>
      <a
        className="dock__btn elm-btn"
        href={site.booking.href}
        tabIndex={hidden ? -1 : undefined}
        aria-hidden={hidden ? true : undefined}
      >
        {site.booking.label}
      </a>
    </div>
  );
}
