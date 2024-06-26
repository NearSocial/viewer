import { useContext } from "react";
import { MutableWebContext } from "./mutable-web-context";

export function useMutableWeb() {
  return useContext(MutableWebContext);
}
