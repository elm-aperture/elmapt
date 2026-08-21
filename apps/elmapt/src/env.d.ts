/// <reference types="vite/client" />

interface ImportMetaEnv {
  /* Absolute base for every photograph the site serves — a bucket URL in
   * production. Absent, the app falls back to the local /res/img symlink. */
  readonly VITE_RES_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
