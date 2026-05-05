import { API_BASE_URL } from "@/core/config";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

function authHeaders(accessToken: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Impossible de charger le catalogue client.";
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

export type CatalogArtisan = {
  id: string;
  name: string;
  title: string;
  location: string;
  heritage: string;
  quote: string;
  bio: string;
  imageUrl: string;
  speciality: string;
  yearsExperience: number;
  productsCount: number;
};

export type CatalogArtisanProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  tag: string | null;
  inStock: boolean;
  href: string;
};

export type CatalogProductListItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export type CatalogProductDetail = {
  id: string;
  name: string;
  artisanId: string;
  category: string;
  subcategory: string;
  price: number;
  description: string;
  details: string[];
  imageUrl: string;
  tag: string | null;
  inStock: boolean;
};

export type CatalogProductSimilar = {
  id: string;
  name: string;
  artisanId: string;
  category: string;
  price: number;
  imageUrl: string;
  tag: string | null;
  inStock: boolean;
};

export class CustomerCatalogService {
  async listArtisans(accessToken: string, limit = 200): Promise<CatalogArtisan[]> {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    const response = await fetch(`${API_BASE_URL}/v1/artisans?${params.toString()}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    const payload = await parseJson<{ items: CatalogArtisan[] }>(response);
    return payload.items ?? [];
  }

  async getArtisanById(accessToken: string, artisanId: string): Promise<CatalogArtisan> {
    const response = await fetch(`${API_BASE_URL}/v1/artisans/${encodeURIComponent(artisanId)}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return unwrap<CatalogArtisan>(response);
  }

  async getArtisanProducts(accessToken: string, artisanId: string): Promise<CatalogArtisanProduct[]> {
    const response = await fetch(
      `${API_BASE_URL}/v1/artisans/${encodeURIComponent(artisanId)}/products`,
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    const payload = await parseJson<{ artisanId: string; items: CatalogArtisanProduct[] }>(response);
    return payload.items ?? [];
  }

  async listProducts(accessToken: string, limit = 500): Promise<CatalogProductListItem[]> {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    const response = await fetch(`${API_BASE_URL}/v1/products?${params.toString()}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    const payload = await parseJson<{ items: CatalogProductListItem[] }>(response);
    return payload.items ?? [];
  }

  async getProductById(accessToken: string, productId: string): Promise<CatalogProductDetail> {
    const response = await fetch(`${API_BASE_URL}/v1/products/${encodeURIComponent(productId)}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return unwrap<CatalogProductDetail>(response);
  }

  async getSimilarProducts(accessToken: string, productId: string, limit = 4): Promise<CatalogProductSimilar[]> {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    const response = await fetch(
      `${API_BASE_URL}/v1/products/${encodeURIComponent(productId)}/similar?${params.toString()}`,
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    const payload = await parseJson<{ items: CatalogProductSimilar[] }>(response);
    return payload.items ?? [];
  }
}
