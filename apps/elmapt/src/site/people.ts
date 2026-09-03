import { resUrl } from "../gallery/sources";
import type { Photographer } from "../gallery/types";

export type PortraitRung = {
  readonly src: string;
  readonly w: number;
};

export type Link = {
  readonly label: string;
  readonly href: string;
};

export type Person = {
  readonly name: Photographer;
  readonly slug: string;
  readonly role: string;
  readonly bio: string;
  readonly portrait: {
    readonly small: PortraitRung;
    readonly full: PortraitRung;

    readonly focus: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
  readonly links: readonly Link[];

  readonly feed?: string;
};

function portrait(slug: string, smallWidth: number, height: number) {
  return {
    small: { src: resUrl(`profile/${slug}/${slug}_thumb.webp`), w: smallWidth },
    full: { src: resUrl(`profile/${slug}/${slug}.webp`), w: 1080 },
    width: 1080,
    height,
  };
}

export const people: readonly Person[] = [
  {
    name: "Rain",
    slug: "rain",
    role: "Lead photographer",
    bio:
      "With ten years' experience in photos and video, i've helped businesses " +
      "and individuals achieve their branding, marketing, and internal goals. " +
      "I believe photography can be a way to express identity and purpose — so " +
      "i shoot everything from models to hotels to testimonials with this in " +
      "mind. My works tend to chase strong colour with even lighting and an " +
      "emphasis on balance.",
    portrait: {
      ...portrait("rain", 400, 1350),
      focus: "50% 50%",
      alt: "Rain in profile against a wall of golden bokeh.",
    },
    links: [
      { label: "@raindfwphotos", href: "https://instagram.com/raindfwphotos" },
      { label: "rain@elmapt.com", href: "mailto:rain@elmapt.com" },

      { label: "469.620.0579", href: "tel:+14696200579" },
    ],
    feed: "53ACNRUgJYRQEQ2FmFSt",
  },
  {
    name: "Maivy",
    slug: "maivy",
    role: "Photographer",
    bio:
      "I've been a photographer for the past two years. What drew me to this " +
      "art form was the ability to connect with people and places in a unique " +
      "way, capturing moments to tell the stories of the people I meet along " +
      "the way. As I refine my skills and build my portfolio, I'm especially " +
      "interested in working more in weddings and with couples, as well as " +
      "capturing shows and events.",
    portrait: {
      ...portrait("maivy", 500, 1350),
      focus: "50% 50%",
      alt: "Maivy photographed at dusk with open water behind her.",
    },
    links: [
      { label: "@maivyphotos", href: "https://instagram.com/maivyphotos" },
      { label: "Vimeo", href: "https://vimeo.com/user204045381" },
      {
        label: "kimirius1999@gmail.com",
        href: "mailto:kimirius1999@gmail.com",
      },
    ],
  },
  {
    name: "Alejandro",
    slug: "alejandro",
    role: "Lead videographer",
    bio:
      "A Dallas-based photographer and videographer obsessed with color, " +
      "atmosphere, and storytelling, whose style blends cinematic lighting " +
      "with expressive portraiture to create images that feel alive. Artists, " +
      "brands, and everyday people — if there's a story to tell, I'm there to " +
      "capture it.",
    portrait: {
      ...portrait("alejandro", 333, 1620),
      focus: "50% 18%",
      alt: "Alejandro with arms folded in front of a shimmering beaded curtain.",
    },
    links: [
      {
        label: "@navalabs_official",
        href: "https://instagram.com/navalabs_official",
      },
      {
        label: "alexnavarro1127@gmail.com",
        href: "mailto:alexnavarro1127@gmail.com",
      },
    ],
    feed: "mdRZb8imZd5bJhCJUgKk",
  },
];

export function findPerson(slug: string): Person | undefined {
  return people.find((person) => person.slug === slug);
}

export function srcSetFor(person: Person): string {
  const { small, full } = person.portrait;
  return `${small.src} ${small.w}w, ${full.src} ${full.w}w`;
}
