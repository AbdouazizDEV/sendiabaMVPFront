import { API_BASE_URL } from "@/core/config";

export type ArtisanMeProfile = {
  userId: string;
  artisanId: string;
  displayName: string;
  email: string;
  phone: string;
  city: string | null;
  craft: string | null;
  bio: string | null;
  avatarUrl: string | null;
  productsCount: number;
};

export type ArtisanProduct = {
  id: string;
  artisanId: string;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  category: string;
  subcategory: string | null;
  tag: string | null;
  stockQuantity?: number;
  promotionActive?: boolean;
  promotionPercent?: number | null;
  promotionReason?: string | null;
  promotionStartedAt?: string | null;
  promotionEndedAt?: string | null;
};

export type ArtisanCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  totalOrders?: number;
};

export type ArtisanOrderStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "in_preparation"
  | "shipped"
  | "delivered";

export type ArtisanOrder = {
  id: string;
  orderNumber?: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  totalAmount?: number;
};

export type ArtisanOrderTrackingEvent = {
  id?: string;
  status: string;
  message?: string;
  createdAt?: string;
};

export type ArtisanOrderTracking = {
  orderId?: string;
  events: ArtisanOrderTrackingEvent[];
};

export type ArtisanNotification = {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
  orderId?: string;
};

export type ArtisanDashboardKpis = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalItemsSold: number;
  totalRevenue: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type Envelope<T> = {
  success?: boolean;
  data: T;
  message?: string;
};

export type UpsertArtisanProductPayload = {
  name: string;
  description: string;
  categorySlug: string;
  subcategorySlug?: string;
  price: number;
  inStock: boolean;
  stockQuantity?: number;
  tag?: string;
  details?: string[] | string;
  file?: File;
};

export type ApplyPromotionPayload = {
  productIds: string[];
  percent: number;
  reason?: string;
};

export type CancelPromotionPayload = {
  productIds: string[];
};

export type UpdateStockPayload = {
  items: Array<{ productId: string; stockQuantity: number }>;
};

function buildAuthHeaders(accessToken: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la requete artisan.";
  try {
    const payload = (await response.json()) as {
      message?: string;
      error?: { message?: string };
    };
    const message = payload.error?.message ?? payload.message ?? fallback;
    return new Error(message);
  } catch {
    return new Error(fallback);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw await parseApiError(response);
  return response.json() as Promise<T>;
}

function normalizeDetailLines(details: UpsertArtisanProductPayload["details"]): string[] {
  if (Array.isArray(details)) {
    return details.map((d) => d.trim()).filter(Boolean);
  }
  const text = typeof details === "string" ? details.trim() : "";
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toMultipartBody(payload: UpsertArtisanProductPayload): FormData {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("description", payload.description);
  form.append("categorySlug", payload.categorySlug);
  form.append("subcategorySlug", payload.subcategorySlug ?? "");
  form.append("price", String(payload.price));
  form.append("inStock", String(payload.inStock));
  if (payload.stockQuantity != null) {
    form.append("stockQuantity", String(payload.stockQuantity));
  }
  form.append("tag", payload.tag ?? "");
  // Le backend exige un tableau : en multipart, repeter le champ "details" pour chaque element
  // (une seule chaine "details" serait valideee comme string, d'ou l'erreur "details must be an array").
  const detailLines = normalizeDetailLines(payload.details);
  for (const line of detailLines) {
    form.append("details", line);
  }
  if (payload.file) {
    form.append("file", payload.file);
  }
  return form;
}

export class ArtisanDashboardService {
  async getMe(accessToken: string): Promise<ArtisanMeProfile> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/me`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    const envelope = await parseJson<Envelope<ArtisanMeProfile>>(response);
    return envelope.data;
  }

  async getKpis(accessToken: string): Promise<ArtisanDashboardKpis> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/dashboard/kpis`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    const envelope = await parseJson<Envelope<ArtisanDashboardKpis>>(response);
    return envelope.data;
  }

  async listProducts(
    accessToken: string,
    options?: {
      search?: string;
      category?: string;
      inStock?: boolean;
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedResponse<ArtisanProduct>> {
    const params = new URLSearchParams();
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 20));
    if (options?.search?.trim()) params.set("search", options.search.trim());
    if (options?.category?.trim()) params.set("category", options.category.trim());
    if (options?.inStock != null) params.set("inStock", String(options.inStock));
    const query = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/products${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    return parseJson<PaginatedResponse<ArtisanProduct>>(response);
  }

  async createProduct(
    accessToken: string,
    payload: UpsertArtisanProductPayload,
  ): Promise<ArtisanProduct> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/products`, {
      method: "POST",
      headers: buildAuthHeaders(accessToken),
      body: toMultipartBody(payload),
    });
    const envelope = await parseJson<Envelope<ArtisanProduct>>(response);
    return envelope.data;
  }

  async getProductById(accessToken: string, productId: string): Promise<ArtisanProduct> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/products/${encodeURIComponent(productId)}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    const payload = await parseJson<{ data: ArtisanProduct } | Envelope<ArtisanProduct>>(response);
    if ("data" in payload) return payload.data;
    return payload as ArtisanProduct;
  }

  async updateProduct(
    accessToken: string,
    productId: string,
    payload: UpsertArtisanProductPayload,
  ): Promise<ArtisanProduct> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/products/${encodeURIComponent(productId)}`,
      {
        method: "PUT",
        headers: buildAuthHeaders(accessToken),
        body: toMultipartBody(payload),
      },
    );
    const envelope = await parseJson<Envelope<ArtisanProduct>>(response);
    return envelope.data;
  }

  async deleteProduct(accessToken: string, productId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/products/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }

  async listCustomers(
    accessToken: string,
    options?: { search?: string; page?: number; limit?: number },
  ): Promise<PaginatedResponse<ArtisanCustomer>> {
    const params = new URLSearchParams();
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 20));
    if (options?.search?.trim()) params.set("search", options.search.trim());
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/customers?${params.toString()}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    return parseJson<PaginatedResponse<ArtisanCustomer>>(response);
  }

  async applyPromotion(accessToken: string, payload: ApplyPromotionPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/products/promotion`, {
      method: "PATCH",
      headers: {
        ...buildAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw await parseApiError(response);
  }

  async cancelPromotion(accessToken: string, payload: CancelPromotionPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/products/promotion/cancel`, {
      method: "PATCH",
      headers: {
        ...buildAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw await parseApiError(response);
  }

  async updateStocks(accessToken: string, payload: UpdateStockPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/products/stock`, {
      method: "PATCH",
      headers: {
        ...buildAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw await parseApiError(response);
  }

  async listOrders(
    accessToken: string,
    options?: { search?: string; status?: string; page?: number; limit?: number },
  ): Promise<PaginatedResponse<ArtisanOrder>> {
    const params = new URLSearchParams();
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 20));
    if (options?.search?.trim()) params.set("search", options.search.trim());
    if (options?.status?.trim()) params.set("status", options.status.trim());
    const response = await fetch(`${API_BASE_URL}/v1/artisan/orders?${params.toString()}`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    return parseJson<PaginatedResponse<ArtisanOrder>>(response);
  }

  async updateOrderStatus(
    accessToken: string,
    orderId: string,
    payload: { status: ArtisanOrderStatus; note?: string },
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/orders/${encodeURIComponent(orderId)}/status`,
      {
        method: "PATCH",
        headers: {
          ...buildAuthHeaders(accessToken),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }

  async sendOrderProgressMail(
    accessToken: string,
    orderId: string,
    payload: { status: ArtisanOrderStatus; message: string },
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/orders/${encodeURIComponent(orderId)}/progress-mail`,
      {
        method: "POST",
        headers: {
          ...buildAuthHeaders(accessToken),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }

  async getOrderTracking(accessToken: string, orderId: string): Promise<ArtisanOrderTracking> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/orders/${encodeURIComponent(orderId)}/tracking`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    const payload = await parseJson<
      ArtisanOrderTracking | { data: ArtisanOrderTracking } | Envelope<ArtisanOrderTracking>
    >(response);
    if ("data" in payload) return payload.data;
    return payload as ArtisanOrderTracking;
  }

  async listNotifications(
    accessToken: string,
    options?: { unreadOnly?: boolean; page?: number; limit?: number },
  ): Promise<ArtisanNotification[]> {
    const params = new URLSearchParams();
    if (options?.unreadOnly != null) {
      params.set("unreadOnly", String(options.unreadOnly));
    }
    if (options?.page != null) params.set("page", String(options.page));
    if (options?.limit != null) params.set("limit", String(options.limit));
    const query = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/notifications${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      },
    );
    const payload = await parseJson<
      PaginatedResponse<ArtisanNotification> | ArtisanNotification[] | { items: ArtisanNotification[] }
    >(response);
    if (Array.isArray(payload)) return payload;
    if ("items" in payload) return payload.items;
    return [];
  }

  async markNotificationAsRead(accessToken: string, notificationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisan/notifications/${encodeURIComponent(notificationId)}/read`,
      {
        method: "PATCH",
        headers: buildAuthHeaders(accessToken),
      },
    );
    if (!response.ok) throw await parseApiError(response);
  }

  async markAllNotificationsAsRead(accessToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/artisan/notifications/read-all`, {
      method: "PATCH",
      headers: buildAuthHeaders(accessToken),
    });
    if (!response.ok) throw await parseApiError(response);
  }
}
