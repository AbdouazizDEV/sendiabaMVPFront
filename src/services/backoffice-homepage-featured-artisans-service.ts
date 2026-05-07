import { API_BASE_URL } from "@/core/config";

export type FeaturedHomepageArtisan = {
  sortOrder: number;
  publicId: string;
  userId: string;
  displayName: string;
  referenceCode: string;
  craft: string;
  city: string;
  avatarUrl: string;
};

export type FeaturedArtisansPutItem = {
  userId: string;
  sortOrder: number;
  publicId?: string;
};

function parseApiErrorPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; error?: { message?: string } };
  return data.error?.message ?? data.message ?? fallback;
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la selection artisans homepage.";
  try {
    const payload = (await response.json()) as unknown;
    return new Error(parseApiErrorPayload(payload, fallback));
  } catch {
    return new Error(fallback);
  }
}

function buildAuthHeaders(accessToken: string, includeJson = false): HeadersInit {
  return {
    Accept: "application/json",
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${accessToken}`,
  };
}

function normalizeItem(raw: unknown): FeaturedHomepageArtisan | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const userId = typeof r.userId === "string" ? r.userId : null;
  const publicId = typeof r.publicId === "string" ? r.publicId : "";
  if (!userId) return null;
  return {
    sortOrder: typeof r.sortOrder === "number" ? r.sortOrder : 0,
    publicId,
    userId,
    displayName: typeof r.displayName === "string" ? r.displayName : "",
    referenceCode: typeof r.referenceCode === "string" ? r.referenceCode : "",
    craft: typeof r.craft === "string" ? r.craft : "",
    city: typeof r.city === "string" ? r.city : "",
    avatarUrl: typeof r.avatarUrl === "string" ? r.avatarUrl : "",
  };
}

function parseItemsPayload(json: unknown): FeaturedHomepageArtisan[] {
  if (!json || typeof json !== "object") return [];
  const o = json as Record<string, unknown>;
  let rawItems: unknown[] = [];
  if (Array.isArray(o.items)) {
    rawItems = o.items;
  } else if (o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    if (Array.isArray(d.items)) rawItems = d.items;
  }
  return rawItems.map(normalizeItem).filter(Boolean) as FeaturedHomepageArtisan[];
}

export class BackofficeHomepageFeaturedArtisansService {
  async list(accessToken: string): Promise<FeaturedHomepageArtisan[]> {
    const response = await fetch(`${API_BASE_URL}/v1/backoffice/homepage/featured-artisans`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    return parseItemsPayload(json);
  }

  async save(
    accessToken: string,
    items: FeaturedArtisansPutItem[],
  ): Promise<FeaturedHomepageArtisan[]> {
    const ordered = items.map((item, index) => ({
      userId: item.userId,
      sortOrder: item.sortOrder ?? index,
      ...(item.publicId ? { publicId: item.publicId } : {}),
    }));

    const response = await fetch(`${API_BASE_URL}/v1/backoffice/homepage/featured-artisans`, {
      method: "PUT",
      headers: buildAuthHeaders(accessToken, true),
      body: JSON.stringify({ items: ordered }),
    });
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    return parseItemsPayload(json);
  }
}
