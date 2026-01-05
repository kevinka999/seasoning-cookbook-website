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
  sub: string;
  email: string;
  aud: string;
  iat?: number;
  exp?: number;
}
