import { useContext, useState } from "react";
import { MutableWebContext } from "./mutable-web-context";

export function useCreateMutation() {
  const { engine, setMutations } = useContext(MutableWebContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMutation = async (creatingMutation) => {
    try {
      setIsLoading(true);

      const createdMutation = await engine.createMutation(creatingMutation);

      setMutations((mutations) => [...mutations, createdMutation]);
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

  return { createMutation, isLoading, error };
}
