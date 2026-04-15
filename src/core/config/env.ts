/**
 * Runtime configuration from Vite env (prefixed with VITE_).
 * Backend base URL is optional until the API exists — empty string keeps the app on static data.
 */
export type AppEnv = {
  /** e.g. https://api.sendiaba.com — no trailing slash */
  apiBaseUrl: string;
};

function normalizeBaseUrl(raw: string | undefined): string {
  if (raw == null || raw.trim() === "") {
    return "";
  }
  return raw.replace(/\/$/, "");
}

export function readAppEnv(): AppEnv {
  return {
    apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_URL),
  };
}

export const appEnv = readAppEnv();
