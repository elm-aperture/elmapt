import { categories } from "../gallery/manifest";
import { useLocation } from "../router/useRoute";
import { site } from "../site/site";
import "../styles/nav.css";

export function TopNav() {
  const { pathname } = useLocation();

  return (
    <header className="nav elm-surface elm-surface--flush">
      <div className="nav__inner elm-container elm-container--wide">
        <a className="nav__mark elm-wordmark" href="/">
          {site.name}
        </a>

        <nav className="nav__links" aria-label="Work">
          {categories.map((category) => {
            const href = `/${category.slug}`;
            const current = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <a
                key={category.slug}
                className="elm-navlink"
                href={href}
                aria-current={current ? "page" : undefined}
              >
                {category.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
