import { API_BASE_URL } from "@/core/config";

export type BackofficeCategory = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  href: string | null;
  sortOrder: number;
  productCount: number;
};

type CategoriesListResponse = {
  items: BackofficeCategory[];
};

function parseApiErrorPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; error?: { message?: string } };
  return data.error?.message ?? data.message ?? fallback;
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la requete categories backoffice.";
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

function normalizeCategory(raw: unknown): BackofficeCategory | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" ? r.id : null;
  const slug = typeof r.slug === "string" ? r.slug : null;
  const title = typeof r.title === "string" ? r.title : null;
  if (!id || !slug || !title) return null;
  return {
    id,
    slug,
    title,
    subtitle: typeof r.subtitle === "string" ? r.subtitle : null,
    description: typeof r.description === "string" ? r.description : null,
    imageUrl: typeof r.imageUrl === "string" ? r.imageUrl : null,
    href: typeof r.href === "string" ? r.href : null,
    sortOrder: typeof r.sortOrder === "number" ? r.sortOrder : 0,
    productCount: typeof r.productCount === "number" ? r.productCount : 0,
  };
}

export type BackofficeCategoryCreatePayload = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  sortOrder?: number;
  file?: File | null;
};

export type BackofficeCategoryUpdatePayload = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  sortOrder?: number;
  file?: File | null;
};

function toFormData(payload: BackofficeCategoryCreatePayload | BackofficeCategoryUpdatePayload): FormData {
  const form = new FormData();
  form.append("slug", payload.slug);
  form.append("title", payload.title);
  if (payload.subtitle != null) form.append("subtitle", payload.subtitle);
  if (payload.description != null) form.append("description", payload.description);
  if (payload.href != null) form.append("href", payload.href);
  if (payload.sortOrder != null) form.append("sortOrder", String(payload.sortOrder));
  if (payload.file) form.append("file", payload.file);
  return form;
}

export class BackofficeCategoriesService {
  async list(accessToken: string, search?: string): Promise<BackofficeCategory[]> {
    const params = new URLSearchParams();
    if (search?.trim()) params.set("search", search.trim());
    const qs = params.toString();
    const url = qs
      ? `${API_BASE_URL}/v1/backoffice/categories?${qs}`
      : `${API_BASE_URL}/v1/backoffice/categories`;
    const response = await fetch(url, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as CategoriesListResponse;
    const items = Array.isArray(json.items) ? json.items : [];
    return items.map(normalizeCategory).filter(Boolean) as BackofficeCategory[];
  }

  async getById(accessToken: string, id: string): Promise<BackofficeCategory> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/categories/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    const row = normalizeCategory(json);
    if (!row) throw new Error("Categorie introuvable.");
    return row;
  }

  async create(accessToken: string, payload: BackofficeCategoryCreatePayload): Promise<BackofficeCategory> {
    const response = await fetch(`${API_BASE_URL}/v1/backoffice/categories`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: toFormData(payload),
    });
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    const row = normalizeCategory(json);
    if (!row) throw new Error("Reponse categorie invalide.");
    return row;
  }

  async update(
    accessToken: string,
    id: string,
    payload: BackofficeCategoryUpdatePayload,
  ): Promise<BackofficeCategory> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/categories/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: toFormData(payload),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    const row = normalizeCategory(json);
    if (!row) throw new Error("Reponse categorie invalide.");
    return row;
  }

  async delete(accessToken: string, id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/categories/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }
}
