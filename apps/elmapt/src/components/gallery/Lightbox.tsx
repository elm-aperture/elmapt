import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Gallery } from "../../gallery/types";
import { fullSrc, intrinsic, srcSetFor, thumbSrc } from "../../gallery/sources";

type LightboxProps = {
  gallery: Gallery;
  frame: number | null;
  onClose: () => void;
  onStep: (delta: number) => void;
};

type FigureVars = CSSProperties & {
  "--lb-ratio"?: number;
};

const SWIPE_THRESHOLD = 48;

export function Lightbox({ gallery, frame, onClose, onStep }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const [shown, setShown] = useState(false);
  /* Which frame's master file has arrived. Keying it by frame rather than
   * clearing a boolean means changing frames needs no reset pass. */
  const [loadedFrame, setLoadedFrame] = useState<number | null>(null);

  const open = frame !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    if (!open && dialog.open) {
      dialog.close();
      setShown(false);
    }
  }, [open]);

  /* Warm the neighbours so arrowing through a delivery does not stutter. */
  useEffect(() => {
    if (frame === null) return;

    const neighbours = [frame - 1, frame + 1]
      .map((n) => ((n - 1 + gallery.count) % gallery.count) + 1)
      .filter((n) => n !== frame);

    const images = neighbours.map((n) => {
      const image = new Image();
      image.src = fullSrc(gallery, n);
      return image;
    });

    return () => {
      for (const image of images) image.src = "";
    };
  }, [frame, gallery]);

  if (frame === null && !shown) {
    return <dialog ref={dialogRef} className="elm-lightbox" aria-label="Photograph" />;
  }

  const index = frame ?? 1;
  const fullLoaded = loadedFrame === index;
  const plate = gallery.plates?.[index - 1];
  const box = intrinsic(gallery);
  const figureStyle: FigureVars = { "--lb-ratio": gallery.ratio };

  return (
    <dialog
      ref={dialogRef}
      className={`elm-lightbox${shown ? " is-in" : ""}`}
      aria-label={plate ? plate.title : "Photograph"}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onStep(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          onStep(1);
        }
      }}
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (start === null) return;
        const dx = (event.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(dx) < SWIPE_THRESHOLD) return;
        onStep(dx > 0 ? -1 : 1);
      }}
    >
      <figure className="elm-lightbox__figure" style={figureStyle}>
        <img
          className="elm-lightbox__img elm-lightbox__img--proxy"
          src={thumbSrc(gallery, index)}
          width={box.width}
          height={box.height}
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <img
          key={index}
          className={`elm-lightbox__img elm-lightbox__img--full${fullLoaded ? " is-loaded" : ""}`}
          src={fullSrc(gallery, index)}
          srcSet={srcSetFor(gallery, index)}
          sizes="100vw"
          width={box.width}
          height={box.height}
          alt={plate ? `${plate.title}${plate.where ? `, ${plate.where}` : ""}` : ""}
          decoding="async"
          draggable={false}
          onLoad={() => setLoadedFrame(index)}
        />

        {plate ? (
          <figcaption className="elm-lightbox__caption">
            <span>{plate.title}</span>
            {plate.where ? <span>{plate.where}</span> : null}
            {plate.by ? (
              <span className="elm-lightbox__by">shot by {plate.by}</span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>

      <div className="elm-lightbox__controls">
        <button
          type="button"
          className="elm-lightbox__control elm-lightbox__control--prev"
          onClick={() => onStep(-1)}
          aria-label="Previous photograph"
        >
          &#8249;
        </button>

        <button
          type="button"
          className="elm-lightbox__control elm-lightbox__control--next"
          onClick={() => onStep(1)}
          aria-label="Next photograph"
        >
          &#8250;
        </button>

        <button
          type="button"
          className="elm-lightbox__control elm-lightbox__control--close"
          onClick={onClose}
          aria-label="Close"
        >
          &#215;
        </button>
      </div>

      <p className="elm-lightbox__count elm-tnum">
        {index} / {gallery.count}
      </p>
    </dialog>
  );
}
