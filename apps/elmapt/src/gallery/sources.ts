import type { Gallery, Rung } from "./types";

export const IMG_BASE = __MEDIA_BASE__;

export function resUrl(path: string): string {
  return `${IMG_BASE}/${path}`;
}

const THUMB: Rung = { w: 500, dir: "thumb", suffix: "_thumb" };
const MID: Rung = { w: 960, dir: "big_thumb", suffix: "_big_thumb" };
const FULL: Rung = { w: 1920, dir: "full", suffix: "" };

export function frameName(gallery: Gallery, frame: number): string {
  return `${gallery.slug}_${String(frame).padStart(gallery.pad, "0")}`;
}

export function sourceAt(gallery: Gallery, frame: number, rung: Rung): string {
  return `${IMG_BASE}/${gallery.dir}/${gallery.slug}/${rung.dir}/${frameName(gallery, frame)}${rung.suffix}.webp`;
}

export function thumbSrc(gallery: Gallery, frame: number): string {
  return sourceAt(gallery, frame, THUMB);
}

export function fullSrc(gallery: Gallery, frame: number): string {
  return sourceAt(gallery, frame, FULL);
}

export function rungsFor(gallery: Gallery): readonly Rung[] {
  return gallery.mid ? [THUMB, MID, FULL] : [THUMB, FULL];
}

export function srcSetFor(gallery: Gallery, frame: number): string {
  return rungsFor(gallery)
    .map((rung) => `${sourceAt(gallery, frame, rung)} ${rung.w}w`)
    .join(", ");
}

export function intrinsic(gallery: Gallery): { width: number; height: number } {
  return { width: 1920, height: Math.round(1920 / gallery.ratio) };
}
