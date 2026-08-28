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
     * arrives — no layout shift, no scroll jump. Every frame is 1920x1280. */
    width: 1920,
    height: 1280,

    /* Sampled from the first frame: what fills the box in the instant before
     * the photograph does. Nothing else is ever seen through. */
    backdrop: "#0f1105",

    /* One photograph at a time, dissolving slowly through all five — one for
     * each thing we shoot, in the order we shoot it.
     *
     * focus is object-position, and it has to be per frame. The box is
     * whatever the nav leaves behind, so the crop is a different shape on
     * every device, and five compositions cannot share one rule: a tower
     * photographed upward wants its top kept, a couple standing at the left
     * edge wants the left kept, and a room wants its far corner. Each value
     * below is the point that survives every crop the frame can take. */
    frames: [
      {
        src: resUrl("carousel/homepage_01.webp"),
        focus: "40% 25%",
        alt: "Portrait of a woman in a black dress seated among dense foliage and orchids.",
      },
      {
        src: resUrl("carousel/homepage_02.webp"),
        focus: "40% 10%",
        alt: "A glass tower photographed from the foot of its fountain court, cloud running behind it.",
      },
      {
        src: resUrl("carousel/homepage_03.webp"),
        focus: "37% 35%",
        alt: "Four people in hats at the rail of an oil pumpjack under an open sky.",
      },
      {
        src: resUrl("carousel/homepage_04.webp"),
        focus: "60% 50%",
        alt: "A white living room with exposed beams, woven baskets and a fireplace.",
      },
      {
        src: resUrl("carousel/homepage_05.webp"),
        focus: "25% 25%",
        alt: "A couple kissing at sunset, the bride's veil trailing across the grass.",
      },
    ],
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
