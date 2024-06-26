import { createContext } from "react";

export const contextDefaultValues = {
  engine: null,
  mutations: [],
  allApps: [],
  mutationApps: [],
  isLoading: false,
  selectedMutation: null,
  favoriteMutationId: null,
  stopEngine: () => undefined,
  switchMutation: async () => undefined,
  setFavoriteMutation: async () => undefined,
  removeMutationFromRecents: async () => undefined,
  setMutations: () => undefined,
  setMutationApps: () => undefined,
};

export const MutableWebContext = createContext(contextDefaultValues);
