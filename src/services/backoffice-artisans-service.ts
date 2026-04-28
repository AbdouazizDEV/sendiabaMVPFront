import { API_BASE_URL } from "@/core/config";

export type BackofficeArtisanStatus = "Actif" | "En attente" | "Suspendu";

export type BackofficeArtisan = {
  id: string;
  fullName: string;
  craft: string;
  city: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string | null;
  status: BackofficeArtisanStatus;
};

type PaginatedArtisansResponse = {
  items: BackofficeArtisan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type Envelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type UploadPhotoData = {
  photoUrl: string;
};

type StatusUpdateData = {
  id: string;
  status: BackofficeArtisanStatus;
  updatedAt: string;
};

function parseApiErrorPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; error?: { message?: string } };
  return data.error?.message ?? data.message ?? fallback;
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la requete artisans backoffice.";
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

export class BackofficeArtisansService {
  async list(
    accessToken: string,
    options?: {
      search?: string;
      status?: BackofficeArtisanStatus | "Tous";
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedArtisansResponse> {
    const params = new URLSearchParams();
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 20));
    if (options?.search?.trim()) params.set("search", options.search.trim());
    if (options?.status && options.status !== "Tous") params.set("status", options.status);

    const response = await fetch(`${API_BASE_URL}/v1/backoffice/artisans?${params.toString()}`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    if (!response.ok) throw await parseApiError(response);
    return response.json() as Promise<PaginatedArtisansResponse>;
  }

  async getById(accessToken: string, artisanId: string): Promise<BackofficeArtisan> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/artisans/${encodeURIComponent(artisanId)}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    return response.json() as Promise<BackofficeArtisan>;
  }

  async update(
    accessToken: string,
    artisanId: string,
    payload: Omit<BackofficeArtisan, "id">,
  ): Promise<BackofficeArtisan> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/artisans/${encodeURIComponent(artisanId)}`,
      {
        method: "PUT",
        headers: buildAuthHeaders(accessToken, true),
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const envelope = (await response.json()) as Envelope<BackofficeArtisan>;
    return envelope.data;
  }

  async uploadPhoto(
    accessToken: string,
    artisanId: string,
    file: File,
  ): Promise<UploadPhotoData> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/artisans/${encodeURIComponent(artisanId)}/photo`,
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
    const envelope = (await response.json()) as Envelope<UploadPhotoData>;
    return envelope.data;
  }

  async updateStatus(
    accessToken: string,
    artisanId: string,
    status: BackofficeArtisanStatus,
  ): Promise<StatusUpdateData> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/artisans/${encodeURIComponent(artisanId)}/status`,
      {
        method: "PATCH",
        headers: buildAuthHeaders(accessToken, true),
        body: JSON.stringify({ status }),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const envelope = (await response.json()) as Envelope<StatusUpdateData>;
    return envelope.data;
  }
}
