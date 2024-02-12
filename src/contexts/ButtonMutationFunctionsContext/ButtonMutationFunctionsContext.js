import { createContext } from "react";
export const contextDefaultValues = {
  selectedButton: "save",
  buttonMutationFunctions: [],
  selectButtonMutationFunctions: () => undefined,
};

export const ButtonMutationFunctionsContext =
  createContext(contextDefaultValues);
