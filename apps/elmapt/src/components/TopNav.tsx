import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { categories } from "../gallery/manifest";
import { pathToPeople, pathToWork } from "../router/routes";
import { useLocation } from "../router/useRoute";
import { onClick, onHover, onLeave } from "./navMenu";
import type { MenuState } from "./navMenu";
import { site } from "../site/site";
import "../styles/nav.css";

type Entry = {
  readonly slug: string;
  readonly label: string;
  readonly base: string;
  readonly items: readonly { readonly href: string; readonly label: string }[];
};

const entries: readonly Entry[] = categories.map((category) => ({
  slug: category.slug,
  label: category.label,
  base: `/${category.slug}`,
  items: category.work.map((work) => ({
    href: pathToWork(category, work),

    label: work.navLabel ?? work.title,
  })),
}));

const PEOPLE = pathToPeople();

type MenuVars = CSSProperties & {
  "--menu-anchor"?: string;
};

const HALF_PANEL = 112;

function anchorFor(trigger: HTMLElement, bar: HTMLElement): number {
  const triggerRect = trigger.getBoundingClientRect();
  const barRect = bar.getBoundingClientRect();
  const raw = triggerRect.left + triggerRect.width / 2 - barRect.left;
  return Math.min(
    Math.max(raw, HALF_PANEL),
    Math.max(barRect.width - HALF_PANEL, HALF_PANEL),
  );
}

export function TopNav() {
  const { pathname } = useLocation();

  const [open, setOpen] = useState<MenuState>(null);
  const openSlug = open?.at === pathname ? open.slug : null;

  const navRef = useRef<HTMLElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement | null>());
  const hover = useRef<number | undefined>(undefined);
  const linger = useRef<number | undefined>(undefined);

  const LINGER = 220;

  const hoverOpen = (slug: string, trigger: HTMLElement) => {
    if (openSlug === slug) return;

    window.clearTimeout(hover.current);
    window.clearTimeout(linger.current);
    const bar = navRef.current;
    if (!bar) return;
    const target = { slug, at: pathname, anchor: anchorFor(trigger, bar) };

    if (openSlug) {
      setOpen((state) => onHover(state, target));
      return;
    }
    hover.current = window.setTimeout(() => {
      setOpen((state) => onHover(state, target));
    }, 120);
  };

  const dismiss = () => {
    window.clearTimeout(hover.current);
    window.clearTimeout(linger.current);
    setOpen(null);
  };

  useEffect(
    () => () => {
      window.clearTimeout(hover.current);
      window.clearTimeout(linger.current);
    },
    [],
  );

  useEffect(() => {
    if (!openSlug) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) dismiss();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(null);

      triggers.current.get(openSlug)?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openSlug]);

  return (
    <header
      className="nav elm-surface elm-surface--flush"
      ref={navRef}
      onPointerEnter={() => window.clearTimeout(linger.current)}
      onPointerLeave={() => {
        window.clearTimeout(hover.current);
        window.clearTimeout(linger.current);
        linger.current = window.setTimeout(() => setOpen(onLeave), LINGER);
      }}
    >
      <div className="nav__inner elm-container elm-container--wide">
        <a className="nav__mark elm-wordmark" href="/" draggable={false}>
          {site.name}
        </a>

        <nav className="nav__links" aria-label="Sections">
          {entries.map((entry) => {
            const expanded = openSlug === entry.slug;
            const current = pathname.startsWith(`${entry.base}/`);
            const panelId = `nav-menu-${entry.slug}`;

            return (
              <span className="nav__item" key={entry.slug}>
                <button
                  type="button"
                  ref={(node) => {
                    triggers.current.set(entry.slug, node);
                  }}
                  className="elm-navlink nav__trigger"
                  aria-expanded={expanded}
                  aria-controls={expanded ? panelId : undefined}
                  aria-current={current ? "page" : undefined}
                  onClick={(event) => {
                    window.clearTimeout(hover.current);
                    const bar = navRef.current;
                    if (!bar) return;
                    const target = {
                      slug: entry.slug,
                      at: pathname,
                      anchor: anchorFor(event.currentTarget, bar),
                    };
                    setOpen((state) => onClick(state, target));
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    hoverOpen(entry.slug, event.currentTarget);
                  }}
                >
                  {entry.label}
                </button>

                {expanded ? (
                  <div
                    className="nav__menu"
                    id={panelId}
                    style={
                      { "--menu-anchor": `${open?.anchor ?? 0}px` } as MenuVars
                    }
                  >
                    <div className="nav__menulist elm-surface">
                      {entry.items.map((item) => (
                        <a
                          key={item.href}
                          className="nav__menulink"
                          href={item.href}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                          draggable={false}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </span>
            );
          })}

          <a
            className="elm-navlink"
            href={PEOPLE}
            aria-current={
              pathname === PEOPLE || pathname.startsWith(`${PEOPLE}/`)
                ? "page"
                : undefined
            }
            draggable={false}
          >
            Photographers
          </a>
        </nav>
      </div>
    </header>
  );
}
