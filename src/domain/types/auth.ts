export type UserRole = "customer" | "admin";

export type AuthSession = {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
};

export type AuthTokenBundle = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthCredentials & {
  displayName: string;
  phone: string;
};
