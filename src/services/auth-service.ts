import { API_BASE_URL } from "@/core/config";
import type {
  AuthCredentials,
  AuthSession,
  AuthTokenBundle,
  RegisterPayload,
} from "@/domain/types";

const SESSION_KEY = "sendiaba.auth.session";
const TOKENS_KEY = "sendiaba.auth.tokens";

type StoredTokens = AuthTokenBundle & {
  issuedAt: number;
};

type AuthApiSuccess = {
  success: boolean;
  session: AuthSession;
  token: AuthTokenBundle;
};

type AuthApiError = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
};

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

function clearStoredAuth(): void {
  if (!inBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(TOKENS_KEY);
}

function parseApiError(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim() !== "") {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  const maybeError = payload as AuthApiError;
  if (maybeError.error?.message) return maybeError.error.message;
  if (maybeError.message) return maybeError.message;
  return fallback;
}

async function postAuthEndpoint(
  path: string,
  body?: unknown,
  bearerToken?: string,
): Promise<AuthApiSuccess> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(parseApiError(payload, "Impossible de joindre le service d'authentification."));
  }

  const data = payload as Partial<AuthApiSuccess>;
  if (!data.session || !data.token) {
    throw new Error("Reponse d'authentification invalide.");
  }

  return {
    success: Boolean(data.success),
    session: data.session,
    token: data.token,
  };
}

function persistAuthSession(session: AuthSession, token: AuthTokenBundle): void {
  safeWrite<AuthSession>(SESSION_KEY, session);
  safeWrite<StoredTokens>(TOKENS_KEY, {
    ...token,
    issuedAt: Date.now(),
  });
}

function normalizeRole(raw: string): AuthSession["role"] {
  return raw.toUpperCase() === "ADMIN" ? "admin" : "customer";
}

function normalizeSession(session: AuthSession): AuthSession {
  return {
    ...session,
    role: normalizeRole(session.role),
  };
}

function hasValidToken(tokens: StoredTokens | null): boolean {
  if (!tokens) return false;
  if (!tokens.accessToken || !tokens.refreshToken) return false;
  const expiresAt = tokens.issuedAt + tokens.expiresIn * 1000;
  return expiresAt > Date.now() + 10_000;
}

export class AuthService {
  getSession(): AuthSession | null {
    const session = safeRead<AuthSession | null>(SESSION_KEY, null);
    const tokens = safeRead<StoredTokens | null>(TOKENS_KEY, null);
    if (!session || !hasValidToken(tokens)) {
      clearStoredAuth();
      return null;
    }
    return normalizeSession(session);
  }

  getAccessToken(): string | null {
    const tokens = safeRead<StoredTokens | null>(TOKENS_KEY, null);
    if (!hasValidToken(tokens)) return null;
    return tokens?.accessToken ?? null;
  }

  async logout(): Promise<void> {
    const token = this.getAccessToken();
    try {
      await postAuthEndpoint("/v1/auth/logout", undefined, token ?? undefined);
    } catch {
      // Even when network/API fails, clear local session to guarantee logout client-side.
    } finally {
      clearStoredAuth();
    }
  }

  async login(payload: AuthCredentials): Promise<AuthSession> {
    const result = await postAuthEndpoint("/v1/auth/login", payload);
    const normalized = normalizeSession(result.session);
    persistAuthSession(normalized, result.token);
    return normalized;
  }

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const result = await postAuthEndpoint("/v1/auth/register", payload);
    const normalized = normalizeSession(result.session);
    persistAuthSession(normalized, result.token);
    return normalized;
  }

  clearLocalSession(): void {
    clearStoredAuth();
  }
}
