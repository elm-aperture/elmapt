import { resUrl } from "../gallery/sources";

export const site = {
  name: "Elm Aperture",

  /** Canonical origin. Used for canonical links, the sitemap and share cards. */
  url: "https://elmapt.com",
  area: "Dallas–Fort Worth",
  description:
    "Photo and video for real estate, portraits and events in Dallas–Fort Worth.",
  founded: 2019,

  contact: {
    email: "rain@elmapt.com",
    phone: "469.620.0579",
    tel: "+14696200579",
    reply: "Replies same day.",
  },

  /** The home page's headline, over the hero. */
  headline: {
    title: "Photo & video in Dallas–Fort Worth",
    line: "Homes, hotels, people and events.",
  },

  hero: {
    width: 1920,
    height: 1280,

    backdrop: "#0f1105",

    frames: [
      {
        src: resUrl("carousel/homepage_01.webp"),
        focus: "42% 25%",
        alt: "Portrait of a woman in a black dress seated among dense foliage and orchids.",
      },
      {
        src: resUrl("carousel/homepage_02.webp"),
        focus: "50% 10%",
        alt: "A glass tower photographed from the foot of its fountain court, cloud running behind it.",
      },
      {
        src: resUrl("carousel/homepage_04.webp"),
        focus: "62% 50%",
        alt: "A white living room with exposed beams, woven baskets and a fireplace.",
      },
      {
        src: resUrl("carousel/homepage_05.webp"),
        focus: "33% 25%",
        alt: "A couple kissing at sunset, the bride's veil trailing across the grass.",
      },
      {
        src: resUrl("carousel/homepage_03.webp"),
        focus: "47% 35%",
        alt: "Four people in hats at the rail of an oil pumpjack under an open sky.",
      },
    ],
  },

  booking: {
    label: "Book a free consultation",
    href: "/booking",
  },

  instagram: {
    href: "https://instagram.com/elm_aperture",
    feed: "yh5fXOj29q5dsG731Dtb",
  },
} as const;
