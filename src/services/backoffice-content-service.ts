import { API_BASE_URL } from "@/core/config";

export type BackofficeContentListItem = {
  key: string;
  scope: string;
  label: string;
  defaultValue: string;
  overrideValue: unknown;
  isCustomized: boolean;
};

export type BackofficeContentEntryDetail = {
  key: string;
  scope: string;
  label: string;
  defaultValue: string;
  overrideValue: unknown;
  effectiveValue: string;
  isCustomized?: boolean;
  updatedAt?: string;
  updatedBy?: { id: string; displayName: string };
};

export type BackofficeContentPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BackofficeContentListResponse = {
  items: BackofficeContentListItem[];
  pagination: BackofficeContentPagination;
};

export type BackofficeContentBulkResult = {
  success: boolean;
  updatedCount: number;
  items: string[];
};

export type BackofficeContentImageUploadData = {
  key: string;
  overrideValue: string;
  effectiveValue: string;
  updatedAt?: string;
};

type Envelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

function parseApiErrorPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; error?: { message?: string } };
  return data.error?.message ?? data.message ?? fallback;
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la requete contenu backoffice.";
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

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as Envelope<T>).data as T;
  }
  return payload as T;
}

export function stringifyOverride(override: unknown): string | null {
  if (override == null || override === "") return null;
  if (typeof override === "string") return override;
  if (typeof override === "number" || typeof override === "boolean") return String(override);
  if (typeof override === "object" && override !== null && !Array.isArray(override)) {
    const keys = Object.keys(override as Record<string, unknown>);
    if (keys.length === 0) return null;
  }
  try {
    return JSON.stringify(override);
  } catch {
    return null;
  }
}

export function effectiveValueFromListItem(row: BackofficeContentListItem): string {
  const ov = stringifyOverride(row.overrideValue);
  if (ov != null && ov !== "") return ov;
  return row.defaultValue ?? "";
}

function normalizePagination(raw: unknown): BackofficeContentPagination {
  const fallback = { page: 1, limit: 30, total: 0, totalPages: 1 };
  if (!raw || typeof raw !== "object") return fallback;
  const p = raw as Record<string, unknown>;
  return {
    page: typeof p.page === "number" ? p.page : fallback.page,
    limit: typeof p.limit === "number" ? p.limit : fallback.limit,
    total: typeof p.total === "number" ? p.total : fallback.total,
    totalPages: typeof p.totalPages === "number" ? p.totalPages : fallback.totalPages,
  };
}

function normalizeListItem(raw: unknown): BackofficeContentListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const key = typeof r.key === "string" ? r.key : null;
  if (!key) return null;
  return {
    key,
    scope: typeof r.scope === "string" ? r.scope : "",
    label: typeof r.label === "string" ? r.label : key,
    defaultValue: typeof r.defaultValue === "string" ? r.defaultValue : "",
    overrideValue: r.overrideValue,
    isCustomized:
      typeof r.isCustomized === "boolean"
        ? r.isCustomized
        : stringifyOverride(r.overrideValue) != null,
  };
}

function normalizeDetail(raw: unknown): BackofficeContentEntryDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const key = typeof r.key === "string" ? r.key : null;
  if (!key) return null;
  const updatedByRaw = r.updatedBy;
  let updatedBy: BackofficeContentEntryDetail["updatedBy"];
  if (updatedByRaw && typeof updatedByRaw === "object") {
    const u = updatedByRaw as Record<string, unknown>;
    if (typeof u.id === "string" && typeof u.displayName === "string") {
      updatedBy = { id: u.id, displayName: u.displayName };
    }
  }
  const isCustomized =
    typeof r.isCustomized === "boolean"
      ? r.isCustomized
      : stringifyOverride(r.overrideValue) != null;

  return {
    key,
    scope: typeof r.scope === "string" ? r.scope : "",
    label: typeof r.label === "string" ? r.label : key,
    defaultValue: typeof r.defaultValue === "string" ? r.defaultValue : "",
    overrideValue: r.overrideValue,
    effectiveValue: typeof r.effectiveValue === "string" ? r.effectiveValue : "",
    isCustomized,
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : undefined,
    updatedBy,
  };
}

function parseListResponse(json: unknown): BackofficeContentListResponse {
  const root = unwrapData<unknown>(json);
  let itemsRaw: unknown[] = [];
  let paginationRaw: unknown = null;

  if (Array.isArray(root)) {
    itemsRaw = root;
  } else if (root && typeof root === "object") {
    const o = root as Record<string, unknown>;
    if (Array.isArray(o.items)) itemsRaw = o.items;
    paginationRaw = o.pagination ?? null;
  } else if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    if (Array.isArray(o.items)) itemsRaw = o.items;
    paginationRaw = o.pagination ?? null;
  }

  const items = itemsRaw.map(normalizeListItem).filter(Boolean) as BackofficeContentListItem[];
  return {
    items,
    pagination: normalizePagination(paginationRaw),
  };
}

export type BackofficeContentBulkItem = {
  key: string;
  value: string;
  scope: string;
  label: string;
  defaultValue: string;
};

export class BackofficeContentService {
  async list(
    accessToken: string,
    options?: {
      scope?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<BackofficeContentListResponse> {
    const params = new URLSearchParams();
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 30));
    if (options?.scope?.trim()) params.set("scope", options.scope.trim());
    if (options?.search?.trim()) params.set("search", options.search.trim());

    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/content-entries?${params.toString()}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    return parseListResponse(json);
  }

  async getByKey(accessToken: string, key: string): Promise<BackofficeContentEntryDetail> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/content-entries/${encodeURIComponent(key)}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    const unwrapped = unwrapData<unknown>(json);
    const detail = normalizeDetail(unwrapped) ?? normalizeDetail(json);
    if (!detail) {
      throw new Error("Reponse contenu invalide.");
    }
    return detail;
  }

  async updateEntry(
    accessToken: string,
    key: string,
    payload: { value: string; scope: string; label: string; defaultValue: string },
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/content-entries/${encodeURIComponent(key)}`,
      {
        method: "PUT",
        headers: buildAuthHeaders(accessToken, true),
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }

  async bulkUpdate(accessToken: string, items: BackofficeContentBulkItem[]): Promise<BackofficeContentBulkResult> {
    const response = await fetch(`${API_BASE_URL}/v1/backoffice/content-entries/bulk`, {
      method: "PUT",
      headers: buildAuthHeaders(accessToken, true),
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw await parseApiError(response);
    return response.json() as Promise<BackofficeContentBulkResult>;
  }

  async deleteOverride(accessToken: string, key: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/content-entries/${encodeURIComponent(key)}/override`,
      {
        method: "DELETE",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }

  async uploadEntryImage(
    accessToken: string,
    key: string,
    file: File,
    meta?: { scope?: string; label?: string; defaultValue?: string },
  ): Promise<BackofficeContentImageUploadData> {
    const formData = new FormData();
    formData.append("file", file);
    if (meta?.scope != null) formData.append("scope", meta.scope);
    if (meta?.label != null) formData.append("label", meta.label);
    if (meta?.defaultValue != null) formData.append("defaultValue", meta.defaultValue);

    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/content-entries/${encodeURIComponent(key)}/image`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    const data = unwrapData<unknown>(json);
    const d = (data && typeof data === "object" ? data : json) as Record<string, unknown>;
    const outKey = typeof d.key === "string" ? d.key : key;
    const overrideValue = typeof d.overrideValue === "string" ? d.overrideValue : "";
    const effectiveValue = typeof d.effectiveValue === "string" ? d.effectiveValue : overrideValue;
    const updatedAt = typeof d.updatedAt === "string" ? d.updatedAt : undefined;
    return { key: outKey, overrideValue, effectiveValue, updatedAt };
  }
}
