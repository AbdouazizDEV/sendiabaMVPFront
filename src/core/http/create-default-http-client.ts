import { appEnv } from "@/core/config";
import { FetchHttpClient } from "./fetch-http-client";

/** Shared client for future API modules — uses `VITE_API_URL` when set. */
export function createDefaultHttpClient(): FetchHttpClient {
  return new FetchHttpClient(appEnv.apiBaseUrl);
}
