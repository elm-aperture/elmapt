import { fullSrc, intrinsic } from "../gallery/sources";
import type { Gallery } from "../gallery/types";
import { people } from "./people";
import { site } from "./site";
import { allPaths, resolve } from "../router/routes";
import type { Screen } from "../router/routes";

export type ShareImage = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

export type PageMeta = {
  readonly title: string;
  readonly description: string;
  readonly image: ShareImage;
  /** Keep out of search and the sitemap. */
  readonly noindex?: boolean;
};

const DESCRIPTION_LIMIT = 160;

/** Trim to a search-snippet length on a word boundary. */
export function clip(text: string, limit = DESCRIPTION_LIMIT): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= limit) return flat;
  const cut = flat.slice(0, limit - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > limit * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
}

const hero = site.hero.frames[0];

const HOME_IMAGE: ShareImage = {
  src: hero.src,
  width: site.hero.width,
  height: site.hero.height,
  alt: hero.alt,
};

function frameImage(gallery: Gallery, frame: number, alt: string): ShareImage {
  return { src: fullSrc(gallery, frame), ...intrinsic(gallery), alt };
}

const titled = (name: string) => `${name} – ${site.name}`;

export function titleFor(screen: Screen): string {
  switch (screen.kind) {
    case "category":
      return titled(screen.category.label);
    case "work":
      return titled(screen.work.title);
    case "study":
      return titled(screen.study.name);
    case "booking":
      return titled(site.booking.label);
    case "privacy":
      return titled("Privacy");
    case "landing":
      return titled(screen.sections[0].work.title);
    case "people":
      return titled("Photographers");
    case "person":
      return titled(screen.person.name);
    case "missing":
      return titled("Not found");
    default:
      return `${site.name} - Photo & Video`;
  }
}

export function metaFor(screen: Screen): PageMeta {
  const title = titleFor(screen);

  switch (screen.kind) {
    case "category": {
      const [first] = screen.category.work;
      return {
        title,
        description: clip(
          `${screen.category.label} photography in ${site.area}: ${screen.category.work
            .map((work) => work.title)
            .join(", ")}.`,
        ),
        image: first
          ? frameImage(first.gallery, first.cover ?? 1, first.title)
          : HOME_IMAGE,
      };
    }
    case "work":
      return {
        title,
        description: clip(screen.work.subtitle),
        image: frameImage(
          screen.work.gallery,
          screen.work.cover ?? 1,
          screen.work.title,
        ),
      };
    case "study":
      return {
        title,
        description: clip(screen.study.line),
        image: frameImage(
          screen.study.gallery,
          screen.study.card.frame,
          screen.study.name,
        ),
      };
    case "person": {
      const { portrait } = screen.person;
      return {
        title,
        description: clip(screen.person.bio),
        image: {
          src: portrait.full.src,
          width: portrait.width,
          height: portrait.height,
          alt: portrait.alt,
        },
      };
    }
    case "people":
      return {
        title,
        description: clip(
          `The photographers of ${site.name}: ${people.map((person) => person.name).join(", ")}.`,
        ),
        image: HOME_IMAGE,
      };
    case "landing": {
      const [{ work }] = screen.sections;
      return {
        title,
        description: clip(work.subtitle),
        image: frameImage(work.gallery, work.cover ?? 1, work.title),
        noindex: true,
      };
    }
    case "privacy":
      return {
        title,
        description: clip(`How ${site.name} handles the information you send us.`),
        image: HOME_IMAGE,
      };
    case "booking":
      return {
        title,
        description: clip(
          `Book a photo or video shoot with ${site.name} in ${site.area}.`,
        ),
        image: HOME_IMAGE,
      };
    default:
      return { title, description: site.description, image: HOME_IMAGE };
  }
}

export type Page = PageMeta & { readonly path: string };

/** Every addressable page, for the sitemap and the per-route HTML shells. */
export function pages(): readonly Page[] {
  return allPaths().map((path) => ({ path, ...metaFor(resolve(path)) }));
}
