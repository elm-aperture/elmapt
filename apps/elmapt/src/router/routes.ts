import { categories } from "../gallery/manifest";
import type { CaseStudy, Category, Work } from "../gallery/types";

/* Route resolution.
 *
 * Because the manifest enumerates every gallery, the whole address space of
 * the site is a finite list that can be built once at module load. No pattern
 * matching, no ordering rules, no catch-all that swallows a typo. */

export type Screen =
  | { readonly kind: "home" }
  | { readonly kind: "category"; readonly category: Category }
  | { readonly kind: "work"; readonly category: Category; readonly work: Work }
  | {
      readonly kind: "study";
      readonly category: Category;
      readonly work: Work;
      readonly study: CaseStudy;
    }
  | { readonly kind: "missing" }
  /* one frame while a legacy address is swapped for its new one */
  | { readonly kind: "redirecting" };

const table = new Map<string, Screen>();

table.set("/", { kind: "home" });

for (const category of categories) {
  table.set(`/${category.slug}`, { kind: "category", category });

  for (const work of category.work) {
    table.set(`/${category.slug}/${work.slug}`, { kind: "work", category, work });

    const study = work.caseStudy;
    if (study) {
      table.set(`/${category.slug}/${work.slug}/${study.slug}`, {
        kind: "study",
        category,
        work,
        study,
      });
    }
  }
}

/* The previous site's flat addresses. They are already in people's texts, so
 * they keep working. `/events` is deliberately absent: it used to be the live
 * events gallery and is now the Events category, which is a better landing
 * for that link than a redirect would be. */
const redirects: Readonly<Record<string, string>> = {
  "/hotel": "/real-estate/hotel",
  "/motel": "/real-estate/motel",
  "/commercial": "/real-estate/commercial",
  "/residential": "/real-estate/residential",
  "/hotel-full": "/real-estate/hotel/holiday-inn-express",
  "/motel-full": "/real-estate/motel/river-valley-inn",
  "/headshot": "/portrait/headshot",
  "/professional": "/portrait/professional",
  "/lifestyle": "/portrait/lifestyle",
  "/wedding": "/events/wedding",
};

function normalise(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function redirectFor(pathname: string): string | undefined {
  return redirects[normalise(pathname)];
}

export function resolve(pathname: string): Screen {
  return table.get(normalise(pathname)) ?? { kind: "missing" };
}

export function pathToWork(category: Category, work: Work): string {
  return `/${category.slug}/${work.slug}`;
}

export function pathToStudy(
  category: Category,
  work: Work,
  study: CaseStudy,
): string {
  return `/${category.slug}/${work.slug}/${study.slug}`;
}

export function allPaths(): readonly string[] {
  return [...table.keys()];
}
