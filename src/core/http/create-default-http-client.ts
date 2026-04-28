import { appEnv } from "@/core/config";
import { FetchHttpClient } from "./fetch-http-client";

/** Shared client for future API modules — uses central API_BASE_URL. */
export function createDefaultHttpClient(): FetchHttpClient {
  return new FetchHttpClient(appEnv.apiBaseUrl);
}
