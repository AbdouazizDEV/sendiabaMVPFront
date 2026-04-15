/** Abstraction over HTTP for future API repositories (DIP). */
export interface IHttpClient {
  getJson<T>(path: string, init?: RequestInit): Promise<T>;
  postJson<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
}
