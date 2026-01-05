export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface User {
  sub: string; // User ID
  email: string;
  aud: string; // Application clientId
  iat?: number; // Issued at
  exp?: number; // Expiration
}
