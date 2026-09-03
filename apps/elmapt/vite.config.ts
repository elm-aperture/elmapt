import { cpSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

const MEDIA_HOST = "https://img.elmapt.com/img";

const CONFIG_DIR = fileURLToPath(new URL(".", import.meta.url));

const isRemote = (base: string) => /^https?:\/\//.test(base);

function mediaHtml(base: string): Plugin {
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
  const env = loadEnv(mode, CONFIG_DIR, "VITE_");
  const override = env.VITE_IMG_BASE?.trim();

  const media = override || MEDIA_HOST;

  if (command === "build" && !isRemote(media)) {
    throw new Error(
      `Media base "${media}" is not an absolute URL. A build serves the ` +
        "photographs from the image host; the bundle does not carry them. " +
        "Unset VITE_IMG_BASE to use the committed default. See DEPLOY.md.",
    );
  }

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

    define: {
      __MEDIA_BASE__: JSON.stringify(media),
    },
    build: {
      copyPublicDir: false,
    },
  };
});
