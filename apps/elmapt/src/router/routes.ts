import { categories } from "../gallery/manifest";
import { people } from "../site/people";
import type { Person } from "../site/people";
import type { CaseStudy, Category, Work } from "../gallery/types";

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
  | { readonly kind: "people" }
  | { readonly kind: "person"; readonly person: Person }
  | { readonly kind: "missing" }
  | { readonly kind: "redirecting" };

const PEOPLE = "/photographers";

const table = new Map<string, Screen>();

table.set("/", { kind: "home" });
table.set(PEOPLE, { kind: "people" });

for (const person of people) {
  table.set(`${PEOPLE}/${person.slug}`, { kind: "person", person });
}

for (const category of categories) {
  table.set(`/${category.slug}`, { kind: "category", category });

  for (const work of category.work) {
    table.set(`/${category.slug}/${work.slug}`, {
      kind: "work",
      category,
      work,
    });

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

const flat: Record<string, string> = {
  "/hotel": "/realestate/hotel",
  "/motel": "/realestate/motel",
  "/commercial": "/realestate/commercial",
  "/residential": "/realestate/residential",
  "/hotel-full": "/realestate/hotel/holiday-inn-express",
  "/motel-full": "/realestate/motel/river-valley-inn",
  "/headshot": "/portrait/headshot",
  "/professional": "/portrait/professional",
  "/lifestyle": "/portrait/lifestyle",
  "/wedding": "/events/wedding",
  "/rain": `${PEOPLE}/rain`,
  "/maivy": `${PEOPLE}/maivy`,
  "/alejandro": `${PEOPLE}/alejandro`,

  "/categoryreference": "/realestate",

  "/real-estate": "/realestate",
  "/real-estate/hotel": "/realestate/hotel",
  "/real-estate/motel": "/realestate/motel",
  "/real-estate/commercial": "/realestate/commercial",
  "/real-estate/residential": "/realestate/residential",
  "/real-estate/hotel/holiday-inn-express":
    "/realestate/hotel/holiday-inn-express",
  "/real-estate/motel/river-valley-inn": "/realestate/motel/river-valley-inn",
};

const redirects: Readonly<Record<string, string>> = flat;

function normalise(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/"))
    return pathname.slice(0, -1);
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

export function pathToPeople(): string {
  return PEOPLE;
}

export function pathToPerson(person: Person): string {
  return `${PEOPLE}/${person.slug}`;
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
