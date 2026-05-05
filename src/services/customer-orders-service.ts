import { API_BASE_URL } from "@/core/config";
import type { CheckoutDetails } from "@/domain/types";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

function authHeaders(accessToken: string, json = false): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Impossible de traiter la commande.";
    try {
      const payload = (await response.json()) as { message?: string; error?: { message?: string } };
      message = payload.error?.message ?? payload.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

async function unwrap<T>(response: Response): Promise<T> {
  const payload = await parseJson<T | ApiEnvelope<T>>(response);
  if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}

export type CheckoutSessionData = {
  reference: string;
  paymentUrl: string;
  status: string;
};

export type PaymentProvider = {
  provider_name: string;
  provider_short_name: string;
  provider_country: string;
  provider_currency: string;
  provider_type: string;
  provider_status: string;
  provider_logo?: string;
};

export type TransactionAttempt = {
  id: string;
  transaction_id: string;
  operator: string;
  status: string;
  cashout_url?: string;
  expires_at?: string;
};

export type CustomerOrderListItem = {
  orderId: string;
  status: string;
  note?: string;
  at: string;
};

export type CustomerOrderTrackingStep = {
  status: string;
  note?: string;
  at: string;
};

export type CustomerOrderTracking = {
  orderId: string;
  timeline: CustomerOrderTrackingStep[];
};

export type CustomerOrderDetail = {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  lines: Array<{
    productId: string;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  checkout: CheckoutDetails;
};

export type CustomerOrderNotification = {
  id: string;
  orderId?: string;
  title?: string;
  message?: string;
  status?: string;
  read?: boolean;
  createdAt?: string;
  at?: string;
};

export class CustomerOrdersService {
  async createCheckoutSession(accessToken: string, checkout: CheckoutDetails): Promise<CheckoutSessionData> {
    const response = await fetch(`${API_BASE_URL}/v1/orders/checkout-session`, {
      method: "POST",
      headers: authHeaders(accessToken, true),
      body: JSON.stringify({ checkout }),
    });
    return unwrap<CheckoutSessionData>(response);
  }

  async listPaymentProviders(
    accessToken: string,
    query: { page?: number; limit?: number; country?: string } = {},
  ): Promise<PaymentProvider[]> {
    const params = new URLSearchParams();
    params.set("page", String(query.page ?? 1));
    params.set("limit", String(query.limit ?? 10));
    if (query.country) params.set("country", query.country);
    const response = await fetch(`${API_BASE_URL}/v1/orders/payments/providers?${params.toString()}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    const payload = await unwrap<{ data: PaymentProvider[]; hasNextPage: boolean }>(response);
    return payload.data ?? [];
  }

  async createTransactionAttempt(
    accessToken: string,
    reference: string,
    payload: {
      payment_method: "mobile_money" | "card";
      operator: string;
      customer: { name: string; phone: string; email: string };
      countryISO: string;
    },
  ): Promise<TransactionAttempt> {
    const response = await fetch(
      `${API_BASE_URL}/v1/orders/payments/checkout-sessions/${encodeURIComponent(reference)}/transaction-attempt`,
      {
        method: "POST",
        headers: authHeaders(accessToken, true),
        body: JSON.stringify(payload),
      },
    );
    return unwrap<TransactionAttempt>(response);
  }

  async listOrders(accessToken: string): Promise<CustomerOrderListItem[]> {
    const response = await fetch(`${API_BASE_URL}/v1/orders`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    const payload = await unwrap<{ items: CustomerOrderListItem[] }>(response);
    return payload.items ?? [];
  }

  async listNotifications(accessToken: string): Promise<CustomerOrderNotification[]> {
    const response = await fetch(`${API_BASE_URL}/v1/orders/me/notifications`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    const payload = await parseJson<
      | CustomerOrderNotification[]
      | { items: CustomerOrderNotification[] }
      | { data: CustomerOrderNotification[] }
      | { data: { items: CustomerOrderNotification[] } }
    >(response);
    if (Array.isArray(payload)) return payload;
    if ("items" in payload && Array.isArray(payload.items)) return payload.items;
    if ("data" in payload && Array.isArray(payload.data)) return payload.data;
    if ("data" in payload && payload.data && "items" in payload.data) {
      return payload.data.items ?? [];
    }
    return [];
  }

  async getOrderTracking(accessToken: string, orderId: string): Promise<CustomerOrderTracking> {
    const response = await fetch(`${API_BASE_URL}/v1/orders/${encodeURIComponent(orderId)}/tracking`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return unwrap<CustomerOrderTracking>(response);
  }

  async getOrderById(accessToken: string, orderId: string): Promise<CustomerOrderDetail> {
    const response = await fetch(`${API_BASE_URL}/v1/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return parseJson<CustomerOrderDetail>(response);
  }
}
