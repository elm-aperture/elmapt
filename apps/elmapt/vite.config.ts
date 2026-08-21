import { cpSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

/* Where the photographs come from.
 *
 * Not from here. The app is a few hundred kilobytes of markup, styles and
 * script; the photographs are two hundred megabytes on their own host, and
 * the two have nothing in common — different sizes, different cadences,
 * different tooling. This build never touches them.
 *
 * Dev reads them through apps/elmapt/public/res, the symlink into the old
 * repo, so a checkout works with no configuration at all. A production build
 * requires VITE_RES_BASE and refuses to run without it. */

const DEV_MEDIA = "/res/img";

const isRemote = (base: string) => /^https?:\/\//.test(base);

/* index.html cannot read import.meta.env, and the hero preload has to be in
 * the markup to be worth anything — it exists to start the largest image on
 * the page before the bundle has even parsed. So the base is substituted at
 * build time, along with a preconnect that opens the connection to the media
 * host before the preload needs it. */
function mediaHtml(base: string): Plugin {
  /* No crossorigin: these are plain <img> fetches, and a preconnect carrying
     crossorigin would warm a CORS connection the images never use. */
  const preconnect = isRemote(base)
    ? `<link rel="preconnect" href="${new URL(base).origin}" />`
    : "";

  return {
    name: "elm-media-html",
    transformIndexHtml(html) {
      return html
        .replaceAll("%MEDIA_BASE%", base)
        .replaceAll("%MEDIA_PRECONNECT%", preconnect);
    },
  };
}

/* Vite's public/ copy is all-or-nothing, and public/ holds the dev symlink —
 * three hundred and seventy megabytes of photographs that must never end up
 * in a deploy. So everything else in public/ is copied by hand. */
function publicAssets(): Plugin {
  let publicDir = "";
  let outDir = "";

  return {
    name: "elm-public-assets",
    apply: "build",
    configResolved(config) {
      publicDir = config.publicDir;
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      if (!publicDir) return;
      for (const entry of readdirSync(publicDir)) {
        if (entry === "res") continue;
        cpSync(join(publicDir, entry), join(outDir, entry), {
          recursive: true,
        });
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const configured = env.VITE_RES_BASE?.trim();

  /* Failing here is the point. A build that quietly produced a photography
     site with no photographs in it would look fine until it was deployed. */
  if (command === "build" && !isRemote(configured ?? "")) {
    throw new Error(
      "VITE_RES_BASE must be set to the media host for a build — an absolute " +
        "URL with no trailing slash, e.g. https://elmapt-media.web.app. " +
        "The photographs are not part of this bundle; see DEPLOY.md.",
    );
  }

  const media = configured || DEV_MEDIA;

  return {
    plugins: [react(), mediaHtml(media), publicAssets()],
    build: {
      copyPublicDir: false,
    },
  };
});
