// src/types/auth.ts

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: 'ADMIN' | 'DIOCESE' | 'VICARIAT' | 'DOYENNE' | 'PAROISSE'
  paroisse?: string
  doyenne?: string
  vicariat?: string
  diocese?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export interface JWTPayload {
  sub: string
  email: string
  role: string
  exp: number
}