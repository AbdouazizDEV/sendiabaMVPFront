export type UserRole = "customer" | "admin";

export type AuthSession = {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthCredentials & {
  displayName: string;
};
