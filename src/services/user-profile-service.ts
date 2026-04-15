import type { AuthSession, UserProfile } from "@/domain/types";

const PROFILES_KEY = "sendiaba.user-profiles";

function inBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeRead<T>(key: string, fallback: T): T {
  if (!inBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (!inBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function toMap(): Record<string, UserProfile> {
  return safeRead<Record<string, UserProfile>>(PROFILES_KEY, {});
}

export class UserProfileService {
  getOrCreate(session: AuthSession): UserProfile {
    const map = toMap();
    const existing = map[session.id];
    if (existing) return existing;

    const created: UserProfile = {
      userId: session.id,
      fullName: session.displayName,
      phone: "",
      country: "Senegal",
      city: "",
      favoriteProductIds: [],
    };
    map[session.id] = created;
    safeWrite(PROFILES_KEY, map);
    return created;
  }

  updatePersonalInfo(
    session: AuthSession,
    payload: Pick<UserProfile, "fullName" | "phone" | "country" | "city">,
  ): UserProfile {
    const map = toMap();
    const profile = this.getOrCreate(session);
    const next: UserProfile = { ...profile, ...payload };
    map[session.id] = next;
    safeWrite(PROFILES_KEY, map);
    return next;
  }

  setFavoriteArtisan(session: AuthSession, artisanId?: string): UserProfile {
    const map = toMap();
    const profile = this.getOrCreate(session);
    const next: UserProfile = { ...profile, favoriteArtisanId: artisanId };
    map[session.id] = next;
    safeWrite(PROFILES_KEY, map);
    return next;
  }

  addFavoriteProduct(session: AuthSession, productId: string): UserProfile {
    const map = toMap();
    const profile = this.getOrCreate(session);
    if (profile.favoriteProductIds.includes(productId)) {
      return profile;
    }
    const next: UserProfile = {
      ...profile,
      favoriteProductIds: [...profile.favoriteProductIds, productId],
    };
    map[session.id] = next;
    safeWrite(PROFILES_KEY, map);
    return next;
  }

  removeFavoriteProduct(session: AuthSession, productId: string): UserProfile {
    const map = toMap();
    const profile = this.getOrCreate(session);
    const next: UserProfile = {
      ...profile,
      favoriteProductIds: profile.favoriteProductIds.filter((id) => id !== productId),
    };
    map[session.id] = next;
    safeWrite(PROFILES_KEY, map);
    return next;
  }
}
