import { resUrl } from "../gallery/sources";

/* Everything on the homepage that is content rather than structure.
 *
 * Categories are not here — they live in gallery/manifest.ts alongside the
 * sets they lead to, so the bar at the top and the addresses it points at
 * cannot drift apart. */

export const site = {
  name: "Elm Aperture",

  hero: {
    /* Dimensions are declared so the frame reserves its box before the file
     * arrives — no layout shift, no scroll jump. */
    src: resUrl("carousel/homepage_01.webp"),
    alt: "Portrait of a woman in a black dress seated among dense foliage and orchids.",
    width: 1920,
    height: 1280,
    backdrop: "#0f1105",
  },

  booking: {
    label: "Book a shoot",
    href: "/booking",
  },

  instagram: {
    href: "https://instagram.com/elm_aperture",
  },

  /* No channel yet — placeholder href until there's somewhere to send it. */
  youtube: {
    href: "#",
  },
} as const;
