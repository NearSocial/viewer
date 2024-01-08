import { useHistory } from "react-router-dom";
import React, { useCallback, useEffect } from "react";

function maybeRedirect(history, newURL) {
  let url = new URL(newURL);
  const hashFragment = url.hash.slice(1);
  const prefixSlash = hashFragment.startsWith("/");
  const numParts = hashFragment.split("/").length;

  if (hashFragment && (prefixSlash || numParts >= 3)) {
    history && history.replace(`${prefixSlash ? "" : "/"}${hashFragment}`);
  }
}

export function useHashRouterLegacy() {
  const history = useHistory();

  const onHashChange = useCallback(
    (event) => {
      maybeRedirect(history, event.newURL);
    },
    [history]
  );

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [onHashChange]);

  useEffect(() => {
    if (!history) {
      return;
    }
    const currentUrl = window.location.href;
    maybeRedirect(history, currentUrl);
  }, [history]);
}
