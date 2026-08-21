import { useState } from "react";
import type { CSSProperties } from "react";
import type { Gallery, Plate } from "../../gallery/types";
import { intrinsic, srcSetFor, thumbSrc } from "../../gallery/sources";
import { sizesFor, spanFor } from "../../gallery/mosaic";

/* One cell of a mosaic.
 *
 * The cell's span decides both how much grid it occupies and what goes in
 * `sizes`, so the browser is told the truth about the drawn width and picks
 * the right rung on its own. Nothing here hard-codes which frames are large. */

type TileProps = {
  gallery: Gallery;
  frame: number;
  plate?: Plate;
  /* an anchor when the tile leads somewhere, a button when it opens the frame */
  href?: string;
  onOpen?: (frame: number) => void;
  eager?: boolean;
  deferred?: boolean;
};

export function Tile({
  gallery,
  frame,
  plate,
  href,
  onOpen,
  eager = false,
  deferred = false,
}: TileProps) {
  const [loaded, setLoaded] = useState(false);
  const span = spanFor(gallery, frame);
  const box = intrinsic(gallery);

  const style: CSSProperties = {
    gridColumn: `span ${span}`,
    gridRow: `span ${span}`,
  };

  const className = ["elm-tile", deferred ? "elm-tile--deferred" : ""]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <img
        className={`elm-tile__img${loaded ? " is-loaded" : ""}`}
        src={thumbSrc(gallery, frame)}
        srcSet={srcSetFor(gallery, frame)}
        sizes={sizesFor(gallery, span)}
        width={box.width}
        height={box.height}
        alt={plate ? `${plate.title}${plate.where ? `, ${plate.where}` : ""}` : ""}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
      />

      {plate ? (
        <span className="elm-tile__plate">
          <span className="elm-tile__title">{plate.title}</span>
          {plate.where ? (
            <span className="elm-tile__where">{plate.where}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a className={`${className} elm-tile--link`} style={style} href={href}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => onOpen?.(frame)}
      aria-label={plate ? `Open ${plate.title}` : `Open frame ${frame}`}
    >
      {inner}
    </button>
  );
}

export function OpenFrame({ span = 1 }: { span?: number }) {
  const style: CSSProperties = {
    gridColumn: `span ${span}`,
    gridRow: `span ${span}`,
  };

  return (
    <span className="elm-tile elm-tile--open" style={style}>
      <span className="elm-tile__open">Open frame</span>
    </span>
  );
}
