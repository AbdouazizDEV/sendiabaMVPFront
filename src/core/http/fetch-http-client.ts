import type { IHttpClient } from "./http-client.interface";

export class FetchHttpClient implements IHttpClient {
  constructor(private readonly baseUrl: string) {}

  private resolve(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (!this.baseUrl) {
      return normalized;
    }
    return `${this.baseUrl}${normalized}`;
  }

  async getJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(this.resolve(path), {
      ...init,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`GET ${path} failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async postJson<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const response = await fetch(this.resolve(path), {
      ...init,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`POST ${path} failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}
