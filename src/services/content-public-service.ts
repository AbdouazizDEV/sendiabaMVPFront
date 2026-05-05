import { API_BASE_URL } from "@/core/config";

export type ContentScope = "home" | "collections" | "category" | "product" | "profile";

export type ContentEntriesResponse = {
  scope: string;
  entries: Record<string, string>;
};

export class ContentPublicService {
  async getEntries(scope: ContentScope): Promise<ContentEntriesResponse> {
    const params = new URLSearchParams();
    params.set("scope", scope);
    const response = await fetch(`${API_BASE_URL}/v1/content?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("Impossible de charger le contenu CMS.");
    }
    return response.json() as Promise<ContentEntriesResponse>;
  }
}
