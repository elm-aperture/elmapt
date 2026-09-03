import { resUrl } from "../gallery/sources";

export const site = {
  name: "Elm Aperture",

  hero: {
    width: 1920,
    height: 1280,

    backdrop: "#0f1105",

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
        src: resUrl("carousel/homepage_04.webp"),
        focus: "60% 50%",
        alt: "A white living room with exposed beams, woven baskets and a fireplace.",
      },
      {
        src: resUrl("carousel/homepage_05.webp"),
        focus: "25% 25%",
        alt: "A couple kissing at sunset, the bride's veil trailing across the grass.",
      },
      {
        src: resUrl("carousel/homepage_03.webp"),
        focus: "37% 35%",
        alt: "Four people in hats at the rail of an oil pumpjack under an open sky.",
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

  youtube: {
    href: "#",
  },
} as const;
