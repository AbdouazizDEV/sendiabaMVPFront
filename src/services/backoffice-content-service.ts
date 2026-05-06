import { API_BASE_URL } from "@/core/config";

export type BackofficeContentEntry = {
  key: string;
  value: string;
  scope?: string;
  label?: string;
  defaultValue?: string;
  isOverridden?: boolean;
};

type Envelope<T> = {
  success?: boolean;
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

function normalizeEntryRow(raw: unknown): BackofficeContentEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const key =
    typeof r.key === "string"
      ? r.key
      : typeof r.entryKey === "string"
        ? r.entryKey
        : typeof r.id === "string"
          ? r.id
          : null;
  if (!key) return null;

  const value =
    typeof r.value === "string"
      ? r.value
      : typeof r.currentValue === "string"
        ? r.currentValue
        : typeof r.body === "string"
          ? r.body
          : typeof r.content === "string"
            ? r.content
            : "";

  const scope = typeof r.scope === "string" ? r.scope : undefined;
  const label = typeof r.label === "string" ? r.label : undefined;
  const defaultValue = typeof r.defaultValue === "string" ? r.defaultValue : undefined;
  const isOverridden =
    typeof r.isOverridden === "boolean"
      ? r.isOverridden
      : typeof r.hasOverride === "boolean"
        ? r.hasOverride
        : undefined;

  return { key, value, scope, label, defaultValue, isOverridden };
}

function parseListPayload(json: unknown): BackofficeContentEntry[] {
  const root = unwrapData<unknown>(json);

  if (Array.isArray(root)) {
    return root.map((row) => normalizeEntryRow(row)).filter(Boolean) as BackofficeContentEntry[];
  }

  if (root && typeof root === "object") {
    const o = root as Record<string, unknown>;

    if (Array.isArray(o.items)) {
      return o.items.map((row) => normalizeEntryRow(row)).filter(Boolean) as BackofficeContentEntry[];
    }

    if (Array.isArray(o.entries) && o.entries.every((x) => typeof x === "object")) {
      return o.entries.map((row) => normalizeEntryRow(row)).filter(Boolean) as BackofficeContentEntry[];
    }

    const entries = o.entries;
    if (entries && typeof entries === "object" && !Array.isArray(entries)) {
      return Object.entries(entries as Record<string, string>).map(([key, value]) =>
        normalizeEntryRow({ key, value }),
      ).filter(Boolean) as BackofficeContentEntry[];
    }
  }

  return [];
}

export class BackofficeContentService {
  async list(accessToken: string): Promise<BackofficeContentEntry[]> {
    const response = await fetch(`${API_BASE_URL}/v1/backoffice/content-entries`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    return parseListPayload(json);
  }

  async getByKey(accessToken: string, key: string): Promise<BackofficeContentEntry> {
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
    const row = normalizeEntryRow(unwrapped);
    if (!row) {
      throw new Error("Reponse contenu invalide.");
    }
    return row;
  }

  async updateEntry(accessToken: string, key: string, value: string): Promise<BackofficeContentEntry> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/content-entries/${encodeURIComponent(key)}`,
      {
        method: "PUT",
        headers: buildAuthHeaders(accessToken, true),
        body: JSON.stringify({ value }),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const json = (await response.json()) as unknown;
    const unwrapped = unwrapData<unknown>(json);
    const row = normalizeEntryRow(unwrapped);
    if (row) return row;
    return { key, value };
  }

  async bulkUpdate(
    accessToken: string,
    updates: { key: string; value: string }[],
  ): Promise<void> {
    const entries = Object.fromEntries(updates.map((u) => [u.key, u.value]));
    const response = await fetch(`${API_BASE_URL}/v1/backoffice/content-entries/bulk`, {
      method: "PUT",
      headers: buildAuthHeaders(accessToken, true),
      body: JSON.stringify({ entries }),
    });
    if (!response.ok) throw await parseApiError(response);
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
}
