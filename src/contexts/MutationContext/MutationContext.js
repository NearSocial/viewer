import { createContext } from "react";

export const contextDefaultValues = {
  selectedMutation: null,
  mutations: [],
  selectMutation: () => undefined,
};

export const MutationContext = createContext(contextDefaultValues);
