import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  view: 'signin' | 'signup';
  openModal: (view?: 'signin' | 'signup') => void;
  closeModal: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  view: 'signin',
  openModal: (view = 'signin') => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
}));