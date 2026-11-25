import { categories } from "../gallery/manifest";
import { people } from "../site/people";
import type { Person } from "../site/people";
import type { CaseStudy, Category, Work } from "../gallery/types";
import { landings } from "../site/landings";
import type { Landing } from "../site/landings";

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
  | { readonly kind: "booking" }
  | { readonly kind: "privacy" }
  | {
      readonly kind: "landing";
      readonly landing: Landing;
      readonly sections: readonly { category: Category; work: Work }[];
    }
  | { readonly kind: "people" }
  | { readonly kind: "person"; readonly person: Person }
  | { readonly kind: "missing" }
  | { readonly kind: "redirecting" };

const PEOPLE = "/photographers";
const BOOKING = "/booking";
const PRIVACY = "/privacy";

const table = new Map<string, Screen>();

table.set("/", { kind: "home" });
table.set(PEOPLE, { kind: "people" });
table.set(BOOKING, { kind: "booking" });
table.set(PRIVACY, { kind: "privacy" });

const LANDING = "/for";

for (const landing of landings) {
  const sections = landing.works.flatMap(([categorySlug, workSlug]) => {
    const category = categories.find((entry) => entry.slug === categorySlug);
    const work = category?.work.find((entry) => entry.slug === workSlug);
    return category && work ? [{ category, work }] : [];
  });
  // A landing whose galleries are all unpublished has nothing to show.
  if (sections.length === 0) continue;
  table.set(`${LANDING}/${landing.slug}`, { kind: "landing", landing, sections });
}

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

  "/book": BOOKING,
  "/contact": BOOKING,

  "/real-estate": "/realestate",
  "/real-estate/hotel": "/realestate/hotel",
  "/real-estate/motel": "/realestate/motel",
  "/real-estate/commercial": "/realestate/commercial",
  "/real-estate/residential": "/realestate/residential",
  "/real-estate/hotel/holiday-inn-express":
    "/realestate/hotel/holiday-inn-express",
  "/real-estate/motel/river-valley-inn": "/realestate/motel/river-valley-inn",
};

export const redirects: Readonly<Record<string, string>> = flat;

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

export function pathToBookingFor(work: Work): string {
  return `${BOOKING}?for=${encodeURIComponent(work.title)}`;
}

export function pathToBooking(): string {
  return BOOKING;
}

/** The booking form with a photographer already chosen. */
export function pathToPrivacy(): string {
  return PRIVACY;
}

export function pathToLanding(landing: Landing): string {
  return `${LANDING}/${landing.slug}`;
}

export function pathToBookPerson(person: Person): string {
  return `${BOOKING}?photographer=${person.slug}`;
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
