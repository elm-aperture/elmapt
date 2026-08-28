import { cpSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
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
 * Dev and build both read them from the image host below. That is the whole
 * configuration: a fresh checkout runs and shows the real site with no .env
 * file, no symlink, and no dependence on which directory the command was
 * typed in.
 *
 * Reading them off disk is a deliberate opt-in: VITE_IMG_BASE=/res/img, which
 * resolves through apps/elmapt/public/res, a symlink into a local copy of the
 * media tree that is not part of a checkout and may not exist. Use it to work
 * without a network, or to look at a re-encode before it goes up. */

/* The image host, committed rather than configured.
 *
 * This URL is the origin of every <img src> on the site — it is in the page
 * source every visitor receives. It is not a secret and cannot become one, so
 * an environment variable is the wrong shape for it. It also stops any host's
 * secret scanner failing the build over a value that necessarily appears in
 * the output.
 *
 * The trailing /img is load-bearing, not decoration: img.elmapt.com serves
 * more than one kind of asset off separate path prefixes, /img is only the
 * one that exists today, and a future /video (or similar) sits beside it
 * rather than under it. */

const MEDIA_HOST = "https://img.elmapt.com/img";

/* Beside this file, which is also the Vite root. Everything below reads from
 * here rather than from the shell's working directory, so it does not matter
 * whether the command was run in this directory or at the monorepo root. */
const CONFIG_DIR = fileURLToPath(new URL(".", import.meta.url));

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

/* Vite's public/ copy is all-or-nothing, and public/ can hold the media
 * symlink — hundreds of megabytes of photographs that must never end up in a
 * deploy. So everything else in public/ is copied by hand. */
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
  /* From beside this config, not from process.cwd(). Read from the cwd, an
     .env.local sitting in this directory is silently missed by `pnpm dev` at
     the monorepo root — and the failure is a homepage showing its backdrop
     and nothing else, with nothing in the console to explain it. */
  const env = loadEnv(mode, CONFIG_DIR, "VITE_");
  const override = env.VITE_IMG_BASE?.trim();

  const media = override || MEDIA_HOST;

  /* A build serving photographs from a relative path would be one that had
     bundled them, which this one never does. */
  if (command === "build" && !isRemote(media)) {
    throw new Error(
      `Media base "${media}" is not an absolute URL. A build serves the ` +
        "photographs from the image host; the bundle does not carry them. " +
        "Unset VITE_IMG_BASE to use the committed default. See DEPLOY.md.",
    );
  }

  /* Reading off disk is opt-in, so a path that does not resolve is a typo or
     a moved folder, not a fallback. Stop on it: the symptom otherwise is a
     site that loads perfectly and shows no photographs. */
  if (!isRemote(media)) {
    const [, top] = media.split("/");
    if (!top || !existsSync(join(CONFIG_DIR, "public", top))) {
      throw new Error(
        `VITE_IMG_BASE is "${media}", which reads the photographs from ` +
          `apps/elmapt/public/${top ?? ""} — and that path does not resolve. ` +
          "public/res is a symlink into a local copy of the media tree; if " +
          "the copy has moved, repoint the symlink, or unset VITE_IMG_BASE " +
          `to use ${MEDIA_HOST}.`,
      );
    }
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
