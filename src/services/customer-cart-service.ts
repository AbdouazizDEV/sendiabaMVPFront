import { API_BASE_URL } from "@/core/config";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  cart?: T;
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
    let message = "Impossible de traiter le panier.";
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

export type CartApiLine = {
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    imageUrl: string;
  };
};

export type CartSnapshot = {
  items: CartApiLine[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  shippingFee: number;
  total: number;
  currency: string;
};

export class CustomerCartService {
  async getCart(accessToken: string): Promise<CartSnapshot> {
    const response = await fetch(`${API_BASE_URL}/v1/cart`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return parseJson<CartSnapshot>(response);
  }

  async addItem(accessToken: string, productId: string, quantity: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/cart/items`, {
      method: "POST",
      headers: authHeaders(accessToken, true),
      body: JSON.stringify({ productId, quantity }),
    });
    await parseJson<ApiEnvelope<unknown>>(response);
  }

  async updateItem(accessToken: string, productId: string, quantity: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/cart/items/${encodeURIComponent(productId)}`, {
      method: "PATCH",
      headers: authHeaders(accessToken, true),
      body: JSON.stringify({ quantity }),
    });
    await parseJson<ApiEnvelope<unknown>>(response);
  }

  async removeItem(accessToken: string, productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/cart/items/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    });
    await parseJson<ApiEnvelope<unknown>>(response);
  }
}
