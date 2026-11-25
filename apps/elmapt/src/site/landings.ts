/** Single-audience landing pages at /for/<slug>: the relevant galleries,
 * their write-ups and the booking form on one page. For ads and direct
 * outreach. Everything shown comes from the gallery manifest; this
 * only says which work goes on which page. Kept out of search (noindex) so
 * they don't compete with the main pages they repeat. */
export type Landing = {
  readonly slug: string;
  /** Eyebrow line above the title. */
  readonly audience: string;
  /** Short name for links, e.g. in the footer. */
  readonly label: string;
  /** [category slug, work slug] pairs, in page order. The first sets the
   * page title and subtitle. */
  readonly works: readonly (readonly [string, string])[];
};

export const landings: readonly Landing[] = [
  {
    slug: "hotels",
    label: "Hotels & motels",
    audience: "For hotels and motels",
    works: [
      ["realestate", "hotel"],
      ["realestate", "motel"],
    ],
  },
  {
    slug: "realtors",
    label: "Realtors & builders",
    audience: "For realtors and builders",
    works: [
      ["realestate", "residential"],
      ["realestate", "commercial"],
    ],
  },
  {
    slug: "teams",
    label: "Companies & teams",
    audience: "For companies and teams",
    works: [
      ["portrait", "headshot"],
      ["portrait", "professional"],
    ],
  },
  {
    slug: "weddings",
    label: "Couples",
    audience: "For couples",
    works: [["events", "wedding"]],
  },
  {
    slug: "events",
    label: "Businesses & hosts",
    audience: "For businesses and hosts",
    works: [["events", "live"]],
  },
];
