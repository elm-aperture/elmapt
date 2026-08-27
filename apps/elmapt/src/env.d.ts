/// <reference types="vite/client" />

/* Where the photographs are served from, substituted at build time. Set in
 * vite.config.ts, which is also what fills in the preload in index.html. */
declare const __MEDIA_BASE__: string;

interface ImportMetaEnv {
  /* Overrides the committed media host for a local build. Not set in CI —
   * see apps/elmapt/.env.example. */
  readonly VITE_IMG_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
