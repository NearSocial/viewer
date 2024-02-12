import { useContext } from "react";

import { ButtonMutationFunctionsContext } from "./ButtonMutationFunctionsContext";

export function useButtonMutationFunctions() {
  return useContext(ButtonMutationFunctionsContext);
}
