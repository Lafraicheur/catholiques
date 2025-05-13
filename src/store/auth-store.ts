import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: number;
  created_at: string;
  email: string;
  pseudo: string;
  statut: string;
  role: string;
  user_id: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
  setAuth: (token: string, user: AdminUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      setAuth: (token, user) => set({ isAuthenticated: true, token, user }),
      clearAuth: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: 'auth-storage', // nom de la clé dans le localStorage
      // N'enregistrer que certaines valeurs du state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);