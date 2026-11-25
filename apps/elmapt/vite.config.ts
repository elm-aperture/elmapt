import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, runnerImport } from "vite";
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

/* The shape of src/site/seo.ts as this config uses it. Declared here rather
 * than imported, so the Node tsconfig never type-checks app code. */
type SeoPage = { readonly path: string };
type Seo = {
  readonly redirects: Readonly<Record<string, string>>;
  pages(): readonly SeoPage[];
  withStructuredData(html: string): string;
  renderShell(html: string, page: SeoPage): string;
  sitemap(list: readonly SeoPage[]): string;
  robots(): string;
  shareCards(list: readonly SeoPage[]): string;
  redirectsFile(table: Readonly<Record<string, string>>): string;
};

/* After the bundle is written: copy public/ into dist, then load the route
 * table through Vite (so the manifest sees the same defines and production
 * mode as the app) and emit one HTML shell per route plus sitemap.xml,
 * robots.txt and _redirects. One hook, so the steps run in order. */
function publicAssets(media: string): Plugin {
  let publicDir = "";
  let outDir = "";
  let root = "";

  return {
    name: "elm-public-assets",
    apply: "build",
    configResolved(config) {
      publicDir = config.publicDir;
      outDir = resolve(config.root, config.build.outDir);
      root = config.root;
    },
    async closeBundle() {
      if (publicDir) {
        for (const entry of readdirSync(publicDir)) {
          if (entry === "res") continue;
          cpSync(join(publicDir, entry), join(outDir, entry), {
            recursive: true,
          });
        }
      }

      const { module: seo } = await runnerImport<Seo>(
        join(root, "src/site/seo.ts"),
        {
          configFile: false,
          root,
          mode: "production",
          logLevel: "warn",
          define: { __MEDIA_BASE__: JSON.stringify(media) },
        },
      );

      const write = (path: string, body: string) => {
        const file = join(outDir, path);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, body);
      };

      const index = seo.withStructuredData(
        readFileSync(join(outDir, "index.html"), "utf8"),
      );

      const list = seo.pages();
      for (const page of list) {
        const file = page.path === "/" ? "/index" : page.path;
        write(`${file}.html`, seo.renderShell(index, page));
      }

      write("sitemap.xml", seo.sitemap(list));
      write("robots.txt", seo.robots());
      write("_redirects", seo.redirectsFile(seo.redirects));

      writeFileSync(
        resolve(root, "../../media/share-cards.json"),
        seo.shareCards(list),
      );
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
          `apps/elmapt/public/${top ?? ""} – and that path does not resolve. ` +
          "public/res is a symlink into a local copy of the media tree; if " +
          "the copy has moved, repoint the symlink, or unset VITE_IMG_BASE " +
          `to use ${MEDIA_HOST}.`,
      );
    }
  }

  return {
    plugins: [react(), mediaHtml(media), publicAssets(media)],

    define: {
      __MEDIA_BASE__: JSON.stringify(media),
    },
    build: {
      copyPublicDir: false,
    },
  };
});
