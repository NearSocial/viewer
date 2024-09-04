import React, { useEffect, useMemo, useState } from "react";
import { MutableWebContext } from "./mutable-web-context";

const MutableWebProvider = ({ children, engine }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMutationId, setSelectedMutationId] = useState(null);
  const [mutations, setMutations] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [mutationApps, setMutationApps] = useState([]);
  const [favoriteMutationId, setFavoriteMutationId] = useState(null);

  const loadMutations = async (engine) => {
    if (!engine) return;
    const [mutations, allApps, selectedMutation, favoriteMutationId] =
      await Promise.all([
        engine.getMutations(),
        engine.getApplications(),
        engine.getCurrentMutation(),
        engine.getFavoriteMutation(),
      ]);

    setMutations(mutations);
    setAllApps(allApps);
    setSelectedMutationId(selectedMutation?.id ?? null);
    setFavoriteMutationId(favoriteMutationId);
  };

  const loadMutationApps = async (engine, selectedMutationId) => {
    if (selectedMutationId) {
      setMutationApps(await engine.getAppsFromMutation(selectedMutationId));
    } else {
      setMutationApps([]);
    }
  };

  const selectedMutation = useMemo(
    () => mutations.find((mut) => mut.id === selectedMutationId) ?? null,
    [mutations, selectedMutationId]
  );

  useEffect(() => {
    loadMutations(engine);
  }, [engine]);

  useEffect(() => {
    loadMutationApps(engine, selectedMutationId);
  }, [engine, selectedMutationId]);

  const stopEngine = () => {
    setSelectedMutationId(null);
    engine.stop();
  };

  // ToDo: move to separate hook
  const switchMutation = async (mutationId) => {
    setSelectedMutationId(mutationId);

    try {
      setIsLoading(true);

      if (engine.started) {
        await engine.switchMutation(mutationId);
      } else {
        await engine.start(mutationId);
      }
    } catch (err) {
      console.error(err);
      // ToDo: save previous mutation and switch back if failed
    } finally {
      setMutations(await engine.getMutations());
      setIsLoading(false);
    }
  };

  // ToDo: move to separate hook
  const setFavoriteMutation = async (mutationId) => {
    const previousFavoriteMutationId = favoriteMutationId;

    try {
      setFavoriteMutationId(mutationId);
      await engine.setFavoriteMutation(mutationId);
    } catch (err) {
      console.error(err);
      setFavoriteMutationId(previousFavoriteMutationId);
    }
  };

  // ToDo: move to separate hook
  const removeMutationFromRecents = async (mutationId) => {
    try {
      await engine.removeMutationFromRecents(mutationId);
      setMutations(await engine.getMutations());
    } catch (err) {
      console.error(err);
    }
  };

  const state = {
    engine,
    mutations,
    allApps,
    mutationApps,
    selectedMutation,
    isLoading,
    favoriteMutationId,
    stopEngine,
    switchMutation,
    setFavoriteMutation,
    removeMutationFromRecents,
    setMutations,
    setMutationApps,
  };

  return (
    <MutableWebContext.Provider value={state}>
      {children}
    </MutableWebContext.Provider>
  );
};

export { MutableWebProvider };
