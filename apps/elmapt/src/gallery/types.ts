/* The gallery engine's vocabulary.
 *
 * Everything here describes what is actually on disk under public/res. The
 * shape is deliberately plain data — no functions, no classes — because the
 * Python ingestion pipeline in tools/ should eventually emit this rather than
 * it being kept by hand. */

export type Photographer = "Rain" | "Maivy" | "Alejandro";

/* The credit on a placeholder frame. The empty slots are inventory,
 * not an oversight, and they say so on the frame.
 * Do not quietly drop them from a count. */
export const UNATTRIBUTED = "no one";

export type Credit = Photographer | typeof UNATTRIBUTED;

/* One rendered resolution. The three that exist today are the three the old
 * site generated: 500px thumbnails, 960px enlargements for the wide cells,
 * and 1920px masters. */
export type Rung = {
  readonly w: number;
  readonly dir: string;
  readonly suffix: string;
};

/* Caption for a single frame. Omitted entirely for deliveries, where 300
 * captions would be noise rather than information. */
export type Plate = {
  readonly title: string;
  readonly where?: string;
  readonly by?: Credit;
};

/* Column counts at the wide, mid and narrow breakpoints. */
export type Columns = readonly [wide: number, mid: number, narrow: number];

export type Gallery = {
  readonly id: string;
  /* asset path parts: public/res/img/{dir}/{slug}/{rung}/{slug}_{NN}.webp */
  readonly dir: string;
  readonly slug: string;
  readonly count: number;
  readonly pad: 2 | 3;
  /* width / height of every frame in the set — the thumbnails are normalised,
   * so one number per gallery is exact rather than an approximation */
  readonly ratio: number;
  /* 1-based frame numbers that have a 960px asset on disk. This single list
   * decides both which cells are enlarged in the mosaic and which frames get
   * a middle rung in srcset, so the layout and the image sizes can no longer
   * disagree with each other. */
  readonly wide: readonly number[];
  readonly cols: Columns;
  /* Frames per complete unit. For a showcase set this is the quota — the
   * number of frames the category must contain, decided once and fixed. For
   * a delivery it is the block a section rounds up to. Either way it is a
   * constant: what the set needs is known before anyone opens a browser, and
   * does not depend on the width of one. */
  readonly block: number;
  readonly plates?: readonly Plate[];
};

export type Prose = {
  readonly heading: string;
  readonly body: string;
};

export type Figure = {
  readonly heading: string;
  readonly src: string;
  readonly alt: string;
};

/* A complete delivery. Density is the point here, so this is the one place in
 * the site that is allowed to be a wall of images. */
export type CaseStudy = {
  readonly slug: string;
  readonly name: string;
  readonly line: string;
  readonly card: {
    readonly label: string;
    readonly blurb: string;
    /* 1-based frame from the delivery used as the card's image */
    readonly frame: number;
  };
  readonly gallery: Gallery;
  /* sparse 1-based frame number -> section label */
  readonly sections: Readonly<Record<number, string>>;
};

export type Work = {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly gallery: Gallery;
  /* 1-based frame that stands for the whole set on its category page.
   * Prefer one the manifest lists as wide — those have a 960px asset, which
   * is the rung a chooser card actually draws at. */
  readonly cover?: number;
  readonly prose?: readonly Prose[];
  readonly figure?: Figure;
  readonly caseStudy?: CaseStudy;
};

export type Category = {
  readonly slug: string;
  readonly label: string;
  readonly work: readonly Work[];
};
