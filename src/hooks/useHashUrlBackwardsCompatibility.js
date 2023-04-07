import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export function useHashUrlBackwardsCompatibility() {
  const history = useHistory();

  function onHashChange(event) {
    const url = event.newURL.split("#").pop() ?? "/";

    if (url[0] === "/") {
      history.replace(url);
    }
  }

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const url = window.location.href.split("#").pop() ?? "/";

      if (url[0] === "/") {
        history.replace(url);
      }
    }
  }, []);
}
