import { useEffect, useState } from "react";
import { SectionHead } from "./SectionHead";
import { useReveal } from "../hooks/useReveal";
import "../styles/feed.css";

/* The element is created imperatively because it is a web component: React
 * owns the empty host div, this effect owns everything inside it, and the two
 * never write to the same nodes. That is the opposite of reaching into a
 * React-rendered tree from outside. */

const WIDGET_SRC = "https://w.behold.so/widget.js";
const WIDGET_TAG = "behold-widget";

/* how long to wait before deciding the widget is never arriving */
const GIVE_UP_MS = 8000;

/* Placeholder tiles held while the feed loads. Twelve divides evenly by every
 * column count the grid resolves to, so the holding pattern never ends on a
 * ragged row. */
const SKELETON_TILES = 12;

type FeedState = "loading" | "ready" | "failed";

export function InstagramFeed({
  feedId,
  eyebrow,
}: {
  feedId: string;
  eyebrow: string;
}) {
  const [state, setState] = useState<FeedState>("loading");
  const { ref: sectionRef, revealed } = useReveal<HTMLElement>();
  const [host, setHost] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!host) return;

    let live = true;
    const settle = (next: FeedState) => {
      if (live) setState(next);
    };

    const widget = document.createElement(WIDGET_TAG);
    widget.setAttribute("feed-id", feedId);
    widget.className = "feed__widget";

    const onWidgetLoad = () => settle("ready");
    widget.addEventListener("load", onWidgetLoad);
    host.appendChild(widget);

    let script = document.querySelector<HTMLScriptElement>(
      `script[data-elm-feed="${WIDGET_TAG}"]`,
    );

    if (!script && !customElements.get(WIDGET_TAG)) {
      script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.type = "module";
      script.async = true;
      script.dataset.elmFeed = WIDGET_TAG;
      document.head.appendChild(script);
    }

    const onScriptError = () => settle("failed");
    script?.addEventListener("error", onScriptError);

    /* If the element upgraded, the feed is live even when the load event was
     * missed. If it never upgraded, the script is gone and the whole section
     * should go with it — a broken embed is worse than no embed. */
    const giveUp = window.setTimeout(() => {
      settle(customElements.get(WIDGET_TAG) ? "ready" : "failed");
    }, GIVE_UP_MS);

    return () => {
      live = false;
      window.clearTimeout(giveUp);
      widget.removeEventListener("load", onWidgetLoad);
      script?.removeEventListener("error", onScriptError);
      widget.remove();
    };
  }, [feedId, host]);

  if (state === "failed") return null;

  return (
    <section
      ref={sectionRef}
      className={`feed elm-section elm-reveal${revealed ? " is-in" : ""}`}
      aria-label={eyebrow}
    >
      <div className="elm-container">
        <SectionHead>{eyebrow}</SectionHead>

        <div className="feed__stage">
          <div
            className={`feed__layer feed__skeleton${
              state === "ready" ? " is-out" : ""
            }`}
            aria-hidden="true"
          >
            {Array.from({ length: SKELETON_TILES }, (_, index) => (
              <div key={index} className="feed__tile elm-skeleton" />
            ))}
          </div>

          <div
            className={`feed__layer feed__host${
              state === "ready" ? " is-in" : ""
            }`}
            ref={setHost}
          />
        </div>
      </div>
    </section>
  );
}
