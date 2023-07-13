import { useLocation } from "react-router-dom";
import React from "react";

export function useQuery() {
  const search = location.search;
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
