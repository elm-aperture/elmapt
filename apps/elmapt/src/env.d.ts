/// <reference types="vite/client" />

declare const __MEDIA_BASE__: string;

interface ImportMetaEnv {
  readonly VITE_IMG_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
