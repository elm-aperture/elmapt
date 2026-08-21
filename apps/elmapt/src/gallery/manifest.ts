import { resUrl } from "./sources";
import { UNATTRIBUTED } from "./types";
import type { Category, CaseStudy, Columns, Gallery, Plate, Work } from "./types";

/* The pair below is not arbitrary and is not free to change casually. Twenty
 * four frames with wide cells at 1, 7, 13 and 19 was checked against CSS's
 * own dense placement at six, four and three columns and leaves no hole at
 * any of them. Nudging either number will almost certainly break that —
 * 24 with wide at {1,2,4,7,13}, for instance, leaves three holes at six
 * columns. Re-verify before changing either. */

export const FRAMES_PER_SET = 24;

export const WIDE_POSITIONS = [1, 7, 13, 19] as const;

/* Deliveries are not sets and have no quota: the job is finished, and there
 * is no number anyone can go and shoot to fill it. Their sections round up to
 * six instead, and their column ladder is chosen so six divides it at every
 * width. */
const DELIVERY_BLOCK = 6;

const LANDSCAPE: Columns = [6, 4, 3];
const UPRIGHT: Columns = [4, 3, 2];
const DELIVERY: Columns = [6, 3, 3];

const WIDESCREEN = 1.5;
const UPRIGHT_RATIO = 2 / 3;

/* ── real estate ──────────────────────────────────────────────────────── */

const hotelGallery: Gallery = {
  id: "hotel",
  dir: "realestate",
  slug: "hotel",
  count: 18,
  pad: 2,
  ratio: WIDESCREEN,
  wide: WIDE_POSITIONS,
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
  plates: [
    { title: "Holiday Inn Express", where: "Schulenberg, TX", by: "Rain" },
    { title: "Ark Suites", where: "Jonesboro, AR", by: "Rain" },
    { title: "IHG Garner", where: "Gonzalez, TX", by: "Rain" },
    { title: "Candlewood Suites", where: "Jonesboro, AR", by: "Rain" },
    { title: "OYO", where: "Beeville, TX", by: "Rain" },
    { title: "Holiday Inn Express", where: "Schulenberg, TX", by: "Rain" },
    { title: "Holiday Inn", where: "Jonesboro, AR", by: "Rain" },
    { title: "Holiday Inn", where: "Jonesboro, AR", by: "Rain" },
    { title: "Holiday Inn", where: "Jonesboro, AR", by: "Rain" },
    { title: "IHG Garner", where: "Gonzalez, TX", by: "Rain" },
    { title: "Candlewood Suites", where: "Jonesboro, AR", by: "Rain" },
    { title: "Ark Suites", where: "Jonesboro, AR", by: "Rain" },
    { title: "Holiday Inn", where: "Jonesboro, AR", by: "Rain" },
    { title: "IHG Garner", where: "Gonzalez, TX", by: "Rain" },
    { title: "Candlewood Suites", where: "Jonesboro, AR", by: "Rain" },
    { title: "IHG Garner", where: "Gonzalez, TX", by: "Rain" },
    { title: "Holiday Inn", where: "Jonesboro, AR", by: "Rain" },
    { title: "Candlewood Suites", where: "Jonesboro, AR", by: "Rain" },
  ],
};

const holidayInnExpress: CaseStudy = {
  slug: "holiday-inn-express",
  name: "Holiday Inn Express",
  line: "Hospitality coverage designed around comfort, atmosphere, and competitive presentation within market class.",
  card: {
    label: "View a full hotel delivery",
    blurb: "347 delivered frames: rooms, lobbies, amenities, exteriors, and guest-facing spaces.",
    frame: 345,
  },
  gallery: {
    id: "hotel-full",
    dir: "realestate",
    slug: "hotel_full",
    count: 347,
    pad: 3,
    ratio: WIDESCREEN,
    wide: [],
    cols: DELIVERY,
    block: DELIVERY_BLOCK,
  },
  sections: {
    1: "Exterior",
    13: "Façade",
    21: "Single King Suite",
    43: "Reception",
    59: "Golden Hour Detail",
    62: "Gazebo & Pool",
    86: "Double Queen Suite",
    139: "ADA Accessible Suite",
    246: "Double Full Suite",
    281: "Dining Area",
    308: "Business Amenities",
    344: "Night Exterior",
  },
};

const motelGallery: Gallery = {
  id: "motel",
  dir: "realestate",
  slug: "motel",
  count: 18,
  pad: 2,
  ratio: WIDESCREEN,
  wide: WIDE_POSITIONS,
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
  plates: [
    { title: "River Valley Motor Inn", where: "La Grange, TX", by: "Rain" },
    { title: "Hotel Bliss", where: "Kemah, TX", by: "Rain" },
    { title: "OYO", where: "Corpus Christi, TX", by: "Rain" },
    { title: "Regency Inn", where: "Bay City, TX", by: "Rain" },
    { title: "Crown Inn", where: "Denver City, TX", by: "Rain" },
    { title: "American Inn", where: "Vernon, TX", by: "Rain" },
    { title: "Fairway Inn", where: "La Porte, TX", by: "Rain" },
    { title: "Plaza Motel", where: "Corpus Christi, TX", by: "Rain" },
    { title: "Vali Ho", where: "Weslaco, TX", by: "Rain" },
    { title: "Moulton Inn", where: "Moulton, TX", by: "Rain" },
    { title: "Castle Inn", where: "Lawton, OK", by: "Rain" },
    { title: "River Valley Motor Inn", where: "La Grange, TX", by: "Rain" },
    { title: "Purple Sage", where: "Snyder, TX", by: "Rain" },
    { title: "Executive Inn", where: "Pleasanton, TX", by: "Rain" },
    { title: "Budget Inn", where: "Corpus Christi, TX", by: "Rain" },
    { title: "Texas Inn", where: "San Benito, TX", by: "Rain" },
    { title: "Lone Star Inn", where: "Harlingen, TX", by: "Rain" },
    { title: "Moulton Inn", where: "Moulton, TX", by: "Rain" },
  ],
};

const riverValleyInn: CaseStudy = {
  slug: "river-valley-inn",
  name: "River Valley Inn",
  line: "A recently repositioned Texas roadside property: updated reception, five room types, accessibility accommodations, and regional detail coverage.",
  card: {
    label: "View a full motel delivery",
    blurb: "178 delivered frames: rooms, signage, amenities, bathrooms, exteriors, and property detail.",
    frame: 6,
  },
  gallery: {
    id: "motel-full",
    dir: "realestate",
    slug: "motel_full",
    count: 178,
    pad: 3,
    ratio: WIDESCREEN,
    wide: [],
    cols: DELIVERY,
    block: DELIVERY_BLOCK,
  },
  sections: {
    1: "Exterior",
    50: "Reception",
    64: "Double Queen",
    85: "Single King",
    103: "Double Full",
    134: "ADA Accessible",
    155: "Premium Double Queen",
  },
};

const commercialGallery: Gallery = {
  id: "commercial",
  dir: "realestate",
  slug: "commercial",
  count: 18,
  pad: 2,
  ratio: WIDESCREEN,
  wide: WIDE_POSITIONS,
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
  plates: [
    { title: "The Mayfair", where: "3400 Welborn", by: "Rain" },
    { title: "Bleu Ciel", where: "3130 N Harwood", by: "Rain" },
    { title: "Highland Gates", where: "4602 Abbott", by: "Rain" },
    { title: "588 Lofts", where: "3110 Thomas", by: "Rain" },
    { title: "The Parks on Travis", where: "3901 Travis", by: "Rain" },
    { title: "HALL Arts", where: "1747 Leonard", by: "Rain" },
    { title: "Norcross Office", where: "Interior", by: "Rain" },
    { title: "Norcross Office", where: "Interior", by: "Rain" },
    { title: "Bryan Place V", where: "3105 San Jacinto", by: "Rain" },
    { title: "The Sorrento", where: "8616 Turtle Creek", by: "Rain" },
    { title: "New Construction", where: "1848 Euclid", by: "Rain" },
    { title: "The W", where: "2340 Victory", by: "Rain" },
    { title: "La Tour Condominiums", where: "3030 McKinney", by: "Rain" },
    { title: "New Construction", where: "3909 Hawthorne", by: "Rain" },
    { title: "Twenty One", where: "3883 Turtle Creek", by: "Rain" },
    { title: "The Stoneleigh", where: "2300 Wolf", by: "Rain" },
    { title: "Azure", where: "2900 McKinney", by: "Rain" },
    { title: "Bleu Ciel", where: "3130 N Harwood", by: "Rain" },
  ],
};

const residentialGallery: Gallery = {
  id: "residential",
  dir: "realestate",
  slug: "residential",
  count: 18,
  pad: 2,
  ratio: WIDESCREEN,
  wide: WIDE_POSITIONS,
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
  plates: [
    { title: "Living Room", where: "bracket", by: "Rain" },
    { title: "Living Room", where: "bracket", by: "Rain" },
    { title: "Furniture", where: "detail", by: "Rain" },
    { title: "Furniture", where: "detail", by: "Rain" },
    { title: "Furniture", where: "detail", by: "Rain" },
    { title: "Main Bed", where: "bracket", by: "Rain" },
    { title: "Main Bed", where: "bracket", by: "Rain" },
    { title: "Main Bath", where: "bracket", by: "Rain" },
    { title: "Bath", where: "detail", by: "Rain" },
    { title: "Bath", where: "detail", by: "Rain" },
    { title: "Kitchen", where: "bracket", by: "Rain" },
    { title: "Kitchen", where: "bracket", by: "Rain" },
    { title: "Main Bath", where: "bracket", by: "Rain" },
    { title: "Kitchen", where: "detail", by: "Rain" },
    { title: "Kitchen", where: "detail", by: "Rain" },
    { title: "Gym", where: "bracket", by: "Rain" },
    { title: "Patio", where: "bracket", by: "Rain" },
    { title: "Patio", where: "detail", by: "Rain" },
  ],
};

/* ── portrait ─────────────────────────────────────────────────────────── */

/* Do not remove filler images; photographer must shoot to them */

const filler: Plate = { title: "filler image", by: UNATTRIBUTED };

const fillTo = (plates: readonly Plate[], total: number): readonly Plate[] => [
  ...plates,
  ...Array.from({ length: total - plates.length }, () => filler),
];

const PORTRAIT_FILES = 18;

const headshotGallery: Gallery = {
  id: "headshot",
  dir: "portrait",
  slug: "headshot",
  count: PORTRAIT_FILES,
  pad: 2,
  ratio: UPRIGHT_RATIO,
  wide: [],
  cols: UPRIGHT,
  block: FRAMES_PER_SET,
  plates: fillTo(
    [
      { title: "Annie", by: "Rain" },
      { title: "Allison", by: "Rain" },
      { title: "Zach", by: "Rain" },
      { title: "Angel", by: "Rain" },
      { title: "Angelina", by: "Rain" },
      { title: "Zimo", by: "Rain" },
      { title: "Zadie", by: "Rain" },
      { title: "Lucinda", by: "Rain" },
      { title: "Julie", by: "Maivy" },
      { title: "Grace", by: "Rain" },
    ],
    PORTRAIT_FILES,
  ),
};

const professionalGallery: Gallery = {
  id: "professional",
  dir: "portrait",
  slug: "professional",
  count: PORTRAIT_FILES,
  pad: 2,
  ratio: UPRIGHT_RATIO,
  wide: [],
  cols: UPRIGHT,
  block: FRAMES_PER_SET,
  plates: fillTo(
    [
      { title: "Jackie", where: "voice actor", by: "Rain" },
      { title: "Gabriel", where: "actor", by: "Rain" },
      { title: "Phuong", where: "sales", by: "Rain" },
      { title: "Thuy Anh", where: "sales", by: "Rain" },
      { title: "Chris", where: "realtor", by: "Rain" },
      { title: "Erik", where: "teacher", by: "Rain" },
      { title: "Dayle", where: "therapist", by: "Rain" },
      { title: "Vashtai", where: "spa director", by: "Rain" },
    ],
    PORTRAIT_FILES,
  ),
};

const lifestyleGallery: Gallery = {
  id: "lifestyle",
  dir: "portrait",
  slug: "lifestyle",
  count: PORTRAIT_FILES,
  pad: 2,
  ratio: UPRIGHT_RATIO,
  wide: [],
  cols: UPRIGHT,
  block: FRAMES_PER_SET,
  plates: fillTo(
    [
      { title: "Nick", where: "Habitat Commons", by: "Rain" },
      { title: "Demi", where: "Ambishen Studio", by: "Rain" },
      { title: "Ambrosia", where: "White Rock Lake", by: "Rain" },
      { title: "Simone", where: "Habitat Commons", by: "Rain" },
      { title: "Jada", where: "Habitat Commons", by: "Rain" },
      { title: "Selia", where: "Fountain Square", by: "Rain" },
      { title: "Amalia", where: "Ambishen Studio", by: "Rain" },
      { title: "Thuan", where: "Downtown Fort Worth", by: "Rain" },
      { title: "Alyssa", where: "Ambishen Studio", by: "Rain" },
      { title: "Kevin", where: "Habitat Commons", by: "Rain" },
      { title: "Jesse", where: "Texas Kill City premiere", by: "Rain" },
      { title: "Christi Lux", where: "Texas Kill City premiere", by: "Rain" },
      { title: "Lilian", where: "Ambishen Studio", by: "Rain" },
      { title: "Adam", where: "Prosper crop field", by: "Rain" },
      { title: "Tea", where: "with an umbrella", by: "Rain" },
    ],
    PORTRAIT_FILES,
  ),
};

/* Not shot into public/res yet. A set with no frames is a real state the
 * engine knows how to render — the vertical exists and says so, and becomes a
 * normal gallery the moment a delivery lands under its slug. */
const artistGallery: Gallery = {
  id: "artist",
  dir: "portrait",
  slug: "artist",
  count: 0,
  pad: 2,
  ratio: UPRIGHT_RATIO,
  wide: [],
  cols: UPRIGHT,
  block: FRAMES_PER_SET,
};

/* ── events ───────────────────────────────────────────────────────────── */

const weddingGallery: Gallery = {
  id: "wedding",
  dir: "events",
  slug: "wedding",
  count: 18,
  pad: 2,
  ratio: WIDESCREEN,
  wide: WIDE_POSITIONS,
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
  plates: [
    { title: "Palos Verdes", where: "wedding", by: "Rain" },
    { title: "The Springs", where: "wedding portraits", by: "Rain" },
    { title: "Serene Lakeside", where: "wedding party", by: "Maivy" },
    { title: "Serene Lakeside", where: "wedding portrait", by: "Maivy" },
    { title: "Mandalay Canal", where: "engagement", by: "Rain" },
    { title: "Japanese Garden", where: "ceremony", by: "Rain" },
    { title: "Japanese Garden", where: "wedding portrait", by: "Rain" },
    { title: "Japanese Garden", where: "wedding portrait", by: "Rain" },
    { title: "Garden Hall", where: "reception", by: "Rain" },
    { title: "Thanksgiving Square", where: "ceremony", by: "Rain" },
    { title: "Thanksgiving Square", where: "ceremony", by: "Rain" },
    { title: "Thanksgiving Square", where: "ceremony", by: "Rain" },
    { title: "Venue Nine-Twenty", where: "wedding portrait", by: "Rain" },
    { title: "Thanksgiving Square", where: "family photos", by: "Rain" },
    { title: "Thanksgiving Square", where: "wedding portrait", by: "Rain" },
    { title: "Thanksgiving Square", where: "wedding portrait", by: "Rain" },
    { title: "Pilgrim Rest Church", where: "ceremony", by: "Maivy" },
    { title: "Pilgrim Rest Church", where: "ceremony", by: "Maivy" },
  ],
};

const liveGallery: Gallery = {
  id: "live",
  dir: "events",
  slug: "events",
  count: 18,
  pad: 2,
  ratio: WIDESCREEN,
  wide: WIDE_POSITIONS,
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
  plates: [
    { title: "Company Meeting", where: "Fort Worth", by: "Maivy" },
    { title: "Oil Rig Visit", where: "West Texas", by: "Rain" },
    { title: "Site Inspection", where: "West Texas", by: "Maivy" },
    { title: "Guided Tour", where: "Dallas", by: "Rain" },
    { title: "Graduation Party", where: "Irving", by: "Maivy" },
    { title: "Graduation Party", where: "Irving", by: "Rain" },
    { title: "Mai Colachi", where: "Carrollton", by: "Rain" },
    { title: "Botswana Independence Day", where: "Argyle", by: "Rain" },
    { title: "Botswana Independence Day", where: "Argyle", by: "Rain" },
    { title: "Roots Remain", where: "Big Rob's", by: "Maivy" },
    { title: "Roots Remain", where: "Big Rob's", by: "Rain" },
    { title: "Eshtadur", where: "Big Rob's", by: "Maivy" },
    { title: "Mogul Red Carpet", where: "Irving", by: "Maivy" },
    { title: "Rooftop Birthday", where: "Dallas", by: "Rain" },
    { title: "Mogul Red Carpet", where: "Irving", by: "Rain" },
    { title: "Engagement Party", where: "Mi Cocina", by: "Rain" },
    { title: "Mogul Red Carpet", where: "Irving", by: "Rain" },
    { title: "Retirement Party", where: "Euless", by: "Rain" },
  ],
};

const concertsGallery: Gallery = {
  id: "concerts",
  dir: "events",
  slug: "concerts",
  count: 0,
  pad: 2,
  ratio: WIDESCREEN,
  wide: [],
  cols: LANDSCAPE,
  block: FRAMES_PER_SET,
};

/* What a set with nothing in it yet says for itself, in one place. */
export const NO_FRAMES = "No frames published yet";

/* ── pages ────────────────────────────────────────────────────────────── */

export const categories: readonly Category[] = [
  {
    slug: "real-estate",
    label: "Real Estate",
    work: [
      {
        slug: "hotel",
        title: "Hotel & Hospitality",
        subtitle: "Guest-facing photography to stand out online.",
        gallery: hotelGallery,
        cover: 13,
        caseStudy: holidayInnExpress,
        prose: [
          {
            heading: "Hospitality Presentation",
            body: "We understand hotel selection is often made in the details: the warmth of a bedside lamp, the openness of reception, the sense of quiet comfort a guest imagines before booking. Those considerations guide coverage across guest rooms, exteriors, and the amenities that shape the overall stay.",
          },
          {
            heading: "Consistent Across Brands",
            body: "You understand your market, your nearby competition, and the parts of the property guests respond to most strongly. Our coverage defaults are informed by years of work with hotels across the South and Midwest, but every property is approached according to its own priorities and clientele. Whether documenting renovated interiors, emphasizing business amenities, or capturing the atmosphere of twilight exteriors, each hotel is best presented through the details that distinguish it within its class.",
          },
        ],
        figure: {
          heading: "Current Coverage",
          src: resUrl("maps/hotel_map_260518.webp"),
          alt: "Hotel and motel photography coverage across the South and Midwest",
        },
      },
      {
        slug: "motel",
        title: "Motel & Extended Stay",
        subtitle: "Complete coverage for clarity in booking.",
        gallery: motelGallery,
        cover: 1,
        caseStudy: riverValleyInn,
        prose: [
          {
            heading: "Complete Motel Coverage",
            body: "We ensure every motel, regardless of location, receives complete and consistent coverage. Every available room type is documented from multiple angles, signage is framed for roadside recognizability, and amenities are captured with dedicated detail shots. Deliveries are organized for straightforward integration into booking platforms, OTA listings, Google, and property websites.",
          },
          {
            heading: "Clear, Consistent Representation",
            body: "You understand your guests, the questions they commonly have, and the features that matter most to your property. Coverage defaults are informed by years of motel-focused work, but property-specific requests can always be incorporated — whether that means emphasizing roadside visibility, highlighting particular amenities, documenting renovations, or clarifying common guest points of confusion.",
          },
        ],
        figure: {
          heading: "Current Coverage",
          src: resUrl("maps/hotel_map_260518.webp"),
          alt: "Hotel and motel photography coverage across the South and Midwest",
        },
      },
      {
        slug: "commercial",
        title: "Commercial Real Estate",
        subtitle: "Architectural coverage for branding or documentation.",
        gallery: commercialGallery,
        cover: 2,
      },
      {
        slug: "residential",
        title: "Residential Real Estate",
        subtitle: "For staged homes and residential listings.",
        gallery: residentialGallery,
        cover: 1,
      },
    ],
  },
  {
    slug: "portrait",
    label: "Portrait",
    work: [
      {
        slug: "headshot",
        title: "Headshots",
        subtitle: "Standardized portraits for corporate, academic, and professional use.",
        gallery: headshotGallery,
        cover: 1,
      },
      {
        slug: "professional",
        title: "Professional Portraits",
        subtitle: "Portrait photography for personal branding, business profiles, and public-facing presentation.",
        gallery: professionalGallery,
        cover: 1,
      },
      {
        slug: "lifestyle",
        title: "Lifestyle Portraits",
        subtitle: "Creative and environmental portraiture emphasizing atmosphere, personality, and styling.",
        gallery: lifestyleGallery,
        cover: 2,
      },
      {
        slug: "artist",
        title: "Artist Portraits",
        subtitle: "Press and promotional portraiture for musicians and performers.",
        gallery: artistGallery,
      },
    ],
  },
  {
    slug: "events",
    label: "Events",
    work: [
      {
        slug: "wedding",
        title: "Wedding Photo and Video",
        subtitle: "Documentary-focused wedding coverage for candid moments, ceremonies, and celebrations.",
        gallery: weddingGallery,
        cover: 1,
        prose: [
          {
            heading: "Documentary-First Coverage",
            body: "Our wedding coverage prioritizes emotion, atmosphere, and authenticity over heavily directed posing. We focus on capturing the interactions, reactions, and small moments that define the day as it unfolds naturally, while still making time for intentional portraits and family photographs.",
          },
          {
            heading: "Flexible Coverage Options",
            body: "Coverage can be structured around single-operator or multi-operator teams depending on the scale and priorities of the event. Photo and video can both be captured simultaneously, and additional requests can usually be accommodated when discussed in advance.",
          },
        ],
      },
      {
        slug: "live",
        title: "Events",
        subtitle: "Flexible coverage for live events, gatherings, and functions.",
        gallery: liveGallery,
        cover: 13,
      },
      {
        slug: "concerts",
        title: "Concerts",
        subtitle: "Stage and room coverage for live music. Stills.",
        gallery: concertsGallery,
      },
    ],
  },
];

/* ── lookup ───────────────────────────────────────────────────────────── */

export function findCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function findWork(
  categorySlug: string,
  workSlug: string,
): { category: Category; work: Work } | undefined {
  const category = findCategory(categorySlug);
  const work = category?.work.find((entry) => entry.slug === workSlug);
  return category && work ? { category, work } : undefined;
}

export function findCaseStudy(
  categorySlug: string,
  workSlug: string,
  studySlug: string,
): { category: Category; work: Work; study: CaseStudy } | undefined {
  const found = findWork(categorySlug, workSlug);
  if (!found?.work.caseStudy || found.work.caseStudy.slug !== studySlug) {
    return undefined;
  }
  return { ...found, study: found.work.caseStudy };
}
