import { memo } from "react";
import { categories } from "../gallery/manifest";
import {
  pathToBooking,
  pathToPeople,
  pathToPrivacy,
  pathToWork,
} from "../router/routes";
import { site } from "../site/site";
import "../styles/sitefooter.css";

/** Instagram accounts listed in the footer: the studio's, then each
 * photographer's own. */
const INSTAGRAM: readonly string[] = [
  "elm_aperture",
  "raindfwphotos",
  "navalabs_official",
  "maivyphotos",
];

/** Scroll whatever is scrolling this footer back to the top: the About sheet
 * on the home page, the window everywhere else. */
function toTop(event: { currentTarget: HTMLElement }) {
  const pane = event.currentTarget.closest<HTMLElement>(".sheet__pane");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = still ? "auto" : "smooth";
  if (pane) pane.scrollTo({ top: 0, behavior });
  else window.scrollTo({ top: 0, behavior });
}

/* Memoised: the home page re-renders on every wheel event while the sheet
 * moves, and this has no props, so it never needs to follow. */
export const SiteFooter = memo(function SiteFooter() {
  return (
    <footer className="sitefoot">
      <div className="sitefoot__inner elm-container">
        <div className="sitefoot__brand">
          <a className="sitefoot__mark elm-wordmark" href="/">
            {site.name}
          </a>
          <p className="sitefoot__area elm-eyebrow">{site.area}</p>
          <p className="sitefoot__reach">
            Serving Texas, with travel across the southern US.
          </p>
        </div>

        <nav className="sitefoot__cols" aria-label="Footer">
          {categories.map((category) => (
            <div className="sitefoot__col" key={category.slug}>
              <h2 className="sitefoot__head elm-eyebrow">
                <a href={`/${category.slug}`}>{category.label}</a>
              </h2>
              <ul>
                {category.work.map((work) => (
                  <li key={work.slug}>
                    <a href={pathToWork(category, work)}>
                      {work.navLabel ?? work.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sitefoot__col">
            <h2 className="sitefoot__head elm-eyebrow">Studio</h2>
            <ul>
              <li>
                <a href={pathToPeople()}>Our Photographers</a>
              </li>
              <li>
                <a href={pathToBooking()}>Free Consultation</a>
              </li>
            </ul>
          </div>

          <div className="sitefoot__col">
            <h2 className="sitefoot__head elm-eyebrow">Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.tel}`}>
                  Call {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`sms:${site.contact.tel}`}>
                  Text {site.contact.phone}
                </a>
              </li>
            </ul>
            <p className="sitefoot__note">{site.contact.reply}</p>
          </div>

          <div className="sitefoot__col">
            <h2 className="sitefoot__head elm-eyebrow">Instagram</h2>
            <ul>
              {INSTAGRAM.map((handle) => (
                <li key={handle}>
                  <a
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sitefoot__legal">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <a href={pathToPrivacy()}>Privacy</a>
          <button type="button" className="sitefoot__top" onClick={toTop}>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
});
