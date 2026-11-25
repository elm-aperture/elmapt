import { useLayoutEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Footer } from "./Footer";
import { About, AboutClose, AboutFaq, AboutProcess, AboutStats } from "./About";
import { PeopleBands } from "./PeopleBands";
import { ServiceTiles } from "./ServiceTiles";
import { HomeFeed } from "./HomeFeed";
import { SiteFooter } from "./SiteFooter";
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
          inert={!open}
          aria-label="About Elm Aperture"
        >
          <ServiceTiles />

          <div className="sheet__inner">
            <h2 className="sheet__title elm-display">About</h2>

            <About />
          </div>

          <AboutStats />
          <AboutProcess />
          <PeopleBands />
          <AboutFaq />
          <HomeFeed />
          <AboutClose />

          <SiteFooter />
        </section>
      </div>
    </div>
  );
}
