import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
