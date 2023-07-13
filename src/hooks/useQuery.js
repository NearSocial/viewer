import { useLocation } from "react-router-dom";
import React from "react";

export function useQuery() {
  let { search } = useLocation();
  if (location.search) {
    if (!search) {
      search = location.search;
    } else {
      search += `&${location.search.substring(1)}`;
    }
  }
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
