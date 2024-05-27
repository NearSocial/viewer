import { useContext, useState } from "react";
import { MutableWebContext } from "./mutable-web-context";

export function useMutationApp(appId) {
  const { engine, setMutationApps } = useContext(MutableWebContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enableApp = async () => {
    try {
      setIsLoading(true);

      await engine.enableApp(appId);

      setMutationApps((apps) =>
        apps.map((app) =>
          app.id === appId
            ? { ...app, settings: { ...app.settings, isEnabled: true } }
            : app
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disableApp = async () => {
    try {
      setIsLoading(true);

      await engine.disableApp(appId);

      setMutationApps((apps) =>
        apps.map((app) =>
          app.id === appId
            ? { ...app, settings: { ...app.settings, isEnabled: false } }
            : app
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { enableApp, disableApp, isLoading, error };
}
