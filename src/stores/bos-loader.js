import { create } from 'zustand';

export const useBosLoaderStore = create((set) => ({
  failedToLoad: false,
  hasResolved: false,
  loaderUrl: '',
  redirectMap: {},
  set: (state) => set((previousState) => ({ ...previousState, ...state })),
}));