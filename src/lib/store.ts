import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  avatarURL?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        setAuth: (user, token) => {
          if (token) {
            Cookies.set('auth-token', token, { expires: 7 }); // 7 days
          } else {
            Cookies.remove('auth-token');
          }
          set({ user, token });
        },
        logout: () => {
          Cookies.remove('auth-token');
          set({ user: null, token: null });
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);

interface UIState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        searchQuery: '',
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        isAddModalOpen: false,
        setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ searchQuery: state.searchQuery }),
      }
    )
  )
);
