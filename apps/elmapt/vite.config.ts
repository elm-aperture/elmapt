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
 * repo, so a checkout works with no configuration at all. A build points at
 * the image host below. */

const DEV_MEDIA = "/res/img";

/* The image host, committed rather than configured.
 *
 * This URL is the origin of every <img src> on the site — it is in the page
 * source every visitor receives. It is not a secret and cannot become one, so
 * an environment variable is the wrong shape for it: Netlify fails any build
 * in which a declared variable's value turns up in the output, and this one
 * necessarily does. Nothing to declare, nothing to scan.
 *
 * VITE_RES_BASE still overrides it, for pointing a local build somewhere
 * else. Do not set it in Netlify — that is the thing that trips the scanner. */

const MEDIA_HOST = "https://elmapt.web.app";

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
  const override = env.VITE_RES_BASE?.trim();

  const media =
    command === "build" ? override || MEDIA_HOST : override || DEV_MEDIA;

  /* A build serving photographs from a relative path would be one that had
     bundled them, which this one never does. */
  if (command === "build" && !isRemote(media)) {
    throw new Error(
      `Media base "${media}" is not an absolute URL. A build serves the ` +
        "photographs from the image host; the bundle does not carry them. " +
        "Unset VITE_RES_BASE to use the committed default. See DEPLOY.md.",
    );
  }

  return {
    plugins: [react(), mediaHtml(media), publicAssets()],
    /* The same value the markup gets, handed to the bundle. index.html and
       the <img> elements have to agree on where the photographs are, and the
       only way to guarantee that is for both to come from this one line. */
    define: {
      __MEDIA_BASE__: JSON.stringify(media),
    },
    build: {
      copyPublicDir: false,
    },
  };
});
