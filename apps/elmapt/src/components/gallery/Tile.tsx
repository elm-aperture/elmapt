import { useCallback } from "react";
import type { CSSProperties } from "react";
import type { Gallery, Plate, Span } from "../../gallery/types";
import { intrinsic, srcSetFor, thumbSrc } from "../../gallery/sources";
import { sizesFor, spanFor } from "../../gallery/mosaic";
import { useLoaded } from "../../hooks/useLoaded";

type TileProps = {
  gallery: Gallery;
  frame: number;
  plate?: Plate;

  href?: string;
  onOpen?: (frame: number) => void;
  eager?: boolean;
  deferred?: boolean;

  hold?: boolean;
  onSettled?: (frame: number) => void;
};

export function Tile({
  gallery,
  frame,
  plate,
  href,
  onOpen,
  eager = false,
  deferred = false,
  hold = false,
  onSettled,
}: TileProps) {
  const settled = useCallback(() => onSettled?.(frame), [onSettled, frame]);
  const { loaded, capture, onLoad, onError } = useLoaded(settled);
  const span = spanFor(gallery, frame);
  const [cols, rows] = span;
  const box = intrinsic(gallery);

  const style: CSSProperties = {
    gridColumn: `span ${cols}`,
    gridRow: `span ${rows}`,
  };

  const className = [
    "elm-tile",
    loaded ? "" : "elm-skeleton",
    deferred ? "elm-tile--deferred" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <img
        ref={capture}
        className={`elm-tile__img${loaded ? " is-loaded" : ""}`}
        src={hold ? undefined : thumbSrc(gallery, frame)}
        srcSet={hold ? undefined : srcSetFor(gallery, frame)}
        sizes={sizesFor(gallery, span)}
        width={box.width}
        height={box.height}
        alt={
          plate ? `${plate.title}${plate.where ? `, ${plate.where}` : ""}` : ""
        }
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onLoad={onLoad}
        onError={onError}
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

export function OpenFrame({ span = [1, 1] }: { span?: Span }) {
  const style: CSSProperties = {
    gridColumn: `span ${span[0]}`,
    gridRow: `span ${span[1]}`,
  };

  return (
    <span className="elm-tile elm-tile--open" style={style}>
      <span className="elm-tile__open">Open frame</span>
    </span>
  );
}
