import type { Gallery, Rung } from "./types";

/* The only code in the app that knows what the folders and suffixes are
 * called, and the only code that knows where any of it is served from.
 * Everything else asks for a frame and a width.
 *
 * The base comes from the environment so that moving the photographs to a
 * bucket is a deployment decision rather than a code change. Unset — which is
 * every local checkout — it falls back to the symlink under public/. */

export const RES_BASE = import.meta.env.VITE_RES_BASE || "/res/img";

/* For the handful of images that are not gallery frames: the hero, the
 * coverage map. Same base, same guarantee. */
export function resUrl(path: string): string {
  return `${RES_BASE}/${path}`;
}

const THUMB: Rung = { w: 500, dir: "thumb", suffix: "_thumb" };
const MID: Rung = { w: 960, dir: "big_thumb", suffix: "_big_thumb" };
const FULL: Rung = { w: 1920, dir: "full", suffix: "" };

export function frameName(gallery: Gallery, frame: number): string {
  return `${gallery.slug}_${String(frame).padStart(gallery.pad, "0")}`;
}

export function sourceAt(gallery: Gallery, frame: number, rung: Rung): string {
  return `${RES_BASE}/${gallery.dir}/${gallery.slug}/${rung.dir}/${frameName(gallery, frame)}${rung.suffix}.webp`;
}

export function thumbSrc(gallery: Gallery, frame: number): string {
  return sourceAt(gallery, frame, THUMB);
}

export function fullSrc(gallery: Gallery, frame: number): string {
  return sourceAt(gallery, frame, FULL);
}

/* The 960px rung only exists for the frames the manifest lists as wide, so
 * quietly offering it for every frame would produce 404s in the network tab
 * and a broken image wherever the browser picked it. */
export function rungsFor(gallery: Gallery, frame: number): readonly Rung[] {
  return gallery.wide.includes(frame) ? [THUMB, MID, FULL] : [THUMB, FULL];
}

export function srcSetFor(gallery: Gallery, frame: number): string {
  return rungsFor(gallery, frame)
    .map((rung) => `${sourceAt(gallery, frame, rung)} ${rung.w}w`)
    .join(", ");
}

/* Intrinsic box, so the tile reserves its exact space before any byte of the
 * image arrives and the page never reflows underneath a reader. */
export function intrinsic(gallery: Gallery): { width: number; height: number } {
  return { width: 1920, height: Math.round(1920 / gallery.ratio) };
}
