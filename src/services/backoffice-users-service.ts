import { API_BASE_URL } from "@/core/config";

export type BackofficeUserRole = "Admin" | "Artisan" | "Client";
export type BackofficeUserStatus = "Actif" | "Inactif" | "Verification";

export type BackofficeUser = {
  id: string;
  name: string;
  email: string;
  role: BackofficeUserRole;
  status: BackofficeUserStatus;
  city: string;
  joinedAt: string;
  totalOrders: number;
};

type PaginatedUsersResponse = {
  items: BackofficeUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type Envelope<T> = {
  success: boolean;
  data: T;
};

type UserRoleUpdateData = {
  id: string;
  role: BackofficeUserRole;
  updatedAt: string;
};

function parseApiErrorPayload(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; error?: { message?: string } };
  return data.error?.message ?? data.message ?? fallback;
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la requete utilisateurs backoffice.";
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

function roleToApi(role: BackofficeUserRole): "ADMIN" | "ARTISAN" | "CUSTOMER" {
  if (role === "Admin") return "ADMIN";
  if (role === "Artisan") return "ARTISAN";
  return "CUSTOMER";
}

export class BackofficeUsersService {
  async list(
    accessToken: string,
    options?: {
      search?: string;
      role?: BackofficeUserRole | "Tous";
      status?: BackofficeUserStatus | "Tous";
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 20));
    if (options?.search?.trim()) params.set("search", options.search.trim());
    if (options?.role && options.role !== "Tous") params.set("role", options.role);
    if (options?.status && options.status !== "Tous") params.set("status", options.status);

    const response = await fetch(`${API_BASE_URL}/v1/backoffice/users?${params.toString()}`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    if (!response.ok) throw await parseApiError(response);
    return response.json() as Promise<PaginatedUsersResponse>;
  }

  async getById(accessToken: string, userId: string): Promise<BackofficeUser> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/users/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    return response.json() as Promise<BackofficeUser>;
  }

  async updateRole(
    accessToken: string,
    userId: string,
    role: BackofficeUserRole,
  ): Promise<UserRoleUpdateData> {
    const response = await fetch(
      `${API_BASE_URL}/v1/backoffice/users/${encodeURIComponent(userId)}/role`,
      {
        method: "PATCH",
        headers: buildAuthHeaders(accessToken, true),
        body: JSON.stringify({ role: roleToApi(role) }),
      },
    );
    if (!response.ok) throw await parseApiError(response);
    const envelope = (await response.json()) as Envelope<UserRoleUpdateData>;
    return envelope.data;
  }
}
