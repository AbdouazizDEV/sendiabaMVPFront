import type {
  AuthCredentials,
  AuthSession,
  RegisterPayload,
  UserRole,
} from "@/domain/types";

type StoredAccount = {
  id: string;
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
};

const SESSION_KEY = "sendiaba.auth.session";
const ACCOUNTS_KEY = "sendiaba.auth.accounts";

const SEEDED_ACCOUNTS: StoredAccount[] = [
  {
    id: "usr-demo-abdou-aziz-diop",
    displayName: "DIOP Abdou Aziz",
    email: "abdouazizdiop583@gmail.com",
    password: "abdouazizdiop",
    role: "customer",
  },
  {
    id: "usr-admin-sendiaba",
    displayName: "Admin Sendiaba",
    email: "admin@sendiaba.com",
    password: "Admin@2026",
    role: "admin",
  },
];

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

function toSession(account: StoredAccount): AuthSession {
  return {
    id: account.id,
    displayName: account.displayName,
    email: account.email,
    role: account.role,
  };
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAccounts(): StoredAccount[] {
  const accounts = safeRead<Array<Partial<StoredAccount>>>(ACCOUNTS_KEY, []);
  let next: StoredAccount[] = accounts
    .filter(
      (account): account is Partial<StoredAccount> &
        Pick<StoredAccount, "id" | "displayName" | "email" | "password"> =>
        Boolean(account.id && account.displayName && account.email && account.password),
    )
    .map((account) => ({
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      password: account.password,
      role: account.role ?? "customer",
    }));

  for (const seed of SEEDED_ACCOUNTS) {
    const hasSeed = next.some(
      (account) => account.email.toLowerCase() === seed.email.toLowerCase(),
    );
    if (!hasSeed) {
      next = [...next, seed];
    }
  }

  if (next.length !== accounts.length) {
    safeWrite(ACCOUNTS_KEY, next);
  }

  return next;
}

export class AuthService {
  getSession(): AuthSession | null {
    return safeRead<AuthSession | null>(SESSION_KEY, null);
  }

  logout(): void {
    if (!inBrowser()) return;
    window.localStorage.removeItem(SESSION_KEY);
  }

  login(payload: AuthCredentials): AuthSession {
    const accounts = getAccounts();
    const account = accounts.find(
      (candidate) =>
        candidate.email.toLowerCase() === payload.email.toLowerCase() &&
        candidate.password === payload.password,
    );

    if (!account) {
      throw new Error("Email ou mot de passe invalide.");
    }

    const session = toSession(account);
    safeWrite(SESSION_KEY, session);
    return session;
  }

  register(payload: RegisterPayload): AuthSession {
    const accounts = getAccounts();
    const alreadyExists = accounts.some(
      (candidate) => candidate.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (alreadyExists) {
      throw new Error("Cet email est deja associe a un compte.");
    }

    const account: StoredAccount = {
      id: createId("usr"),
      displayName: payload.displayName,
      email: payload.email,
      password: payload.password,
      role: "customer",
    };

    safeWrite(ACCOUNTS_KEY, [...accounts, account]);
    const session = toSession(account);
    safeWrite(SESSION_KEY, session);
    return session;
  }
}
