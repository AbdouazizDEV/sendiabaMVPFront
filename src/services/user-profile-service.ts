import { API_BASE_URL } from "@/core/config";
import type { UserProfile } from "@/domain/types";

type ProfileEnvelope<T> = {
  success: boolean;
  data: T;
};

type FavoriteArtisanPayload = {
  favoriteArtisanId: string | null;
};

type FavoriteProductsPayload = {
  favoriteProductIds: string[];
};

function buildAuthHeaders(accessToken: string, includeJson = false): HeadersInit {
  return {
    Accept: "application/json",
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${accessToken}`,
  };
}

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de traiter la requete profil.";
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

async function assertOk<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await parseApiError(response);
  }
  return response.json() as Promise<T>;
}

export class UserProfileService {
  async getCurrentProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/v1/profile/me`, {
      method: "GET",
      headers: buildAuthHeaders(accessToken),
    });
    return assertOk<UserProfile>(response);
  }

  async updatePersonalInfo(
    accessToken: string,
    payload: Pick<UserProfile, "fullName" | "phone" | "country" | "city">,
  ): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/v1/profile/me/personal-info`, {
      method: "PUT",
      headers: buildAuthHeaders(accessToken, true),
      body: JSON.stringify(payload),
    });
    const envelope = await assertOk<ProfileEnvelope<UserProfile>>(response);
    return envelope.data;
  }

  async setFavoriteArtisan(
    accessToken: string,
    artisanId?: string,
  ): Promise<FavoriteArtisanPayload> {
    const response = await fetch(`${API_BASE_URL}/v1/profile/me/favorite-artisan`, {
      method: "PUT",
      headers: buildAuthHeaders(accessToken, true),
      body: JSON.stringify({ artisanId: artisanId ?? null }),
    });
    const envelope = await assertOk<ProfileEnvelope<FavoriteArtisanPayload>>(response);
    return envelope.data;
  }

  async addFavoriteProduct(
    accessToken: string,
    productId: string,
  ): Promise<FavoriteProductsPayload> {
    const response = await fetch(`${API_BASE_URL}/v1/profile/me/favorite-products`, {
      method: "POST",
      headers: buildAuthHeaders(accessToken, true),
      body: JSON.stringify({ productId }),
    });
    const envelope = await assertOk<ProfileEnvelope<FavoriteProductsPayload>>(response);
    return envelope.data;
  }

  async removeFavoriteProduct(
    accessToken: string,
    productId: string,
  ): Promise<FavoriteProductsPayload> {
    const response = await fetch(
      `${API_BASE_URL}/v1/profile/me/favorite-products/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        headers: buildAuthHeaders(accessToken),
      },
    );
    const envelope = await assertOk<ProfileEnvelope<FavoriteProductsPayload>>(response);
    return envelope.data;
  }
}
