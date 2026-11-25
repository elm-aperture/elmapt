export type Photographer = "Rain" | "Maivy" | "Alejandro";

export const UNATTRIBUTED = "no one";

export type Credit = Photographer | typeof UNATTRIBUTED;

export type Rung = {
  readonly w: number;
  readonly dir: string;
  readonly suffix: string;
};

export type Plate = {
  readonly title: string;
  readonly where?: string;
  readonly by?: Credit;
};

export type Span = readonly [cols: number, rows: number];

export type Columns = readonly [wide: number, mid: number, narrow: number];

export type Gallery = {
  readonly id: string;

  readonly dir: string;
  readonly slug: string;
  readonly count: number;

  /** Display position (1-based) -> source frame number. Lets a gallery be
   * re-sequenced without renaming files: file URLs, plates and credits all
   * stay keyed to the source frame; `spans` stay keyed to display position. */
  readonly order?: readonly number[];

  /** Display position (1-based) -> CSS object-position, for a frame whose
   * source shape differs from its tile (a portrait in a landscape cell). */
  readonly focus?: Readonly<Record<number, string>>;
  readonly pad: 2 | 3;

  readonly ratio: number;

  readonly spans: Readonly<Record<number, Span>>;

  readonly mid?: boolean;
  readonly cols: Columns;

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

export type CaseStudy = {
  readonly slug: string;
  readonly name: string;
  readonly line: string;
  readonly card: {
    readonly label: string;
    readonly blurb: string;

    readonly frame: number;
  };
  readonly gallery: Gallery;

  readonly sections: Readonly<Record<number, string>>;
};

export type Work = {
  readonly slug: string;
  readonly title: string;

  readonly navLabel?: string;
  readonly subtitle: string;
  readonly gallery: Gallery;

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
