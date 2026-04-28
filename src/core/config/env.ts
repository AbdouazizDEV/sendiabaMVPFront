import { API_BASE_URL } from "./api-url";

/**
 * Runtime app configuration.
 */
export type AppEnv = {
  /** Backend API base URL (no trailing slash). */
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
    apiBaseUrl: normalizeBaseUrl(API_BASE_URL),
  };
}

export const appEnv = readAppEnv();
