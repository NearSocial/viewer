import { create } from 'zustand';

export const useCurrentComponentStore = create((set) => ({
  src: null,
  setSrc: (src) => set(() => ({ src })),
}));