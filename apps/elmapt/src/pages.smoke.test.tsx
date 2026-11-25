// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import App from "./App";
import { navigate } from "./router/history";
import { allPaths, resolve } from "./router/routes";
import type { Screen } from "./router/routes";
import { people } from "./site/people";
import { site } from "./site/site";

/** Text each kind of page must show, proving the right page rendered. */
function heading(screen: Screen): string | null {
  switch (screen.kind) {
    case "category":
      return screen.category.label;
    case "work":
      return screen.work.title;
    case "study":
      return screen.study.name;
    case "person":
      return screen.person.name;
    case "people":
      return "Photographers";
    case "booking":
      return site.booking.label;
    case "landing":
      return screen.sections[0].work.title;
    default:
      return null;
  }
}

const escape = (text: string) => text.replace(/&/g, "&amp;");

describe("every page renders", () => {
  it.each(allPaths())("%s", (path) => {
    navigate(path, { replace: true, scroll: false });
    const html = renderToString(<App />);
    const expected = heading(resolve(path));
    expect(html).toContain("<main");
    if (expected) expect(html).toContain(escape(expected));
  });

  it("the home page carries every photographer and the footer", () => {
    navigate("/", { replace: true, scroll: false });
    const html = renderToString(<App />);
    for (const person of people) expect(html).toContain(person.name);
    expect(html).toContain("sitefoot");
  });

  it("inner pages carry the footer, with the Photographers link", () => {
    navigate("/booking", { replace: true, scroll: false });
    const html = renderToString(<App />);
    expect(html).toContain("sitefoot");
    expect(html).toContain('href="/photographers"');
  });

  it("landing pages keep the site navigation and end with the form", () => {
    navigate("/for/hotels", { replace: true, scroll: false });
    const html = renderToString(<App />);
    expect(html).toContain('class="nav');
    expect(html).toContain("sitefoot");
    expect(html).toContain('id="book"');
  });

  it("an unknown address renders the not-found page", () => {
    navigate("/no/such/page", { replace: true, scroll: false });
    expect(renderToString(<App />)).toContain("Not here");
  });
});
