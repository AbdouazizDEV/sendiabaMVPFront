/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Sendiaba backend (no trailing slash). Optional while using static seed data. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
