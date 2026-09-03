import { useLayoutEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Footer } from "./Footer";
import type { SheetState } from "../hooks/useSheet";
import "../styles/sheet.css";

type SheetVars = CSSProperties & {
  "--sheet-shift"?: string;
  "--sheet-settle"?: string;
  "--sheet-top"?: string;
};

function useMeasured(selector: string): number | null {
  const [size, setSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = document.querySelector(selector);
    if (!node) return;

    const measure = () =>
      setSize(Math.round(node.getBoundingClientRect().height));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [selector]);

  return size;
}

export function Sheet({ sheet }: { sheet: SheetState }) {
  const {
    open,
    settling,
    wheeling,
    shift,
    settle,
    carriage,
    pane,
    handle,
    toggle,
  } = sheet;
  const navHeight = useMeasured(".nav");

  const keyboardOnly = (event: { detail: number }) => {
    if (event.detail === 0) toggle();
  };

  return (
    <div
      className="sheet__clip"
      style={
        {
          "--sheet-top": navHeight === null ? undefined : `${navHeight}px`,
        } as SheetVars
      }
    >
      <div
        ref={carriage}
        className={`sheet${wheeling ? " sheet--wheeling" : settling ? " sheet--settling" : ""}`}
        style={
          {
            "--sheet-shift": shift,
            "--sheet-settle": `${settle}ms`,
          } as SheetVars
        }
      >
        <Footer handle={handle} expanded={open} onToggle={toggle} />

        <button
          type="button"
          className="sheet__grip"
          aria-label="Close about"
          aria-hidden={!open}
          tabIndex={open ? undefined : -1}
          onClick={keyboardOnly}
          {...handle}
        />

        <section
          ref={pane}
          className="sheet__pane"
          aria-hidden={!open}
          aria-label="About Elm Aperture"
        >
          <div className="sheet__inner">
            <h2 className="sheet__title elm-display">About</h2>

            <p className="elm-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <p className="elm-body">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>

            <p className="elm-body">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
