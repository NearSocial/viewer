import { useContext } from "react";

import { MutationContext } from "./MutationContext";

export function useMutation() {
  return useContext(MutationContext);
}
