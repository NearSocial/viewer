import { useCallback, useState, useEffect } from "react";

export const useMutationLocalStorage = () => {
  // ***** STATE *****

  const [mutations, setMutations] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    setMutations(getAllMutations());
  }, [getAllMutations, updateCounter]);

  // ***** VIEW *****

  const getAllMutations = useCallback(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("mutableWeb:mutations")
    );
    const mutations = keys.map((key) =>
      localStorage[key] ? JSON.parse(localStorage[key]) : null
    );
    return mutations.filter((mutation) => !!mutation);
  }, []);

  const getMutationById = useCallback((id) => {
    const json = localStorage[`mutableWeb:mutations:${id}`];
    return json ? JSON.parse(json) : null;
  }, []);

  // ***** CALL *****

  const createMutation = useCallback((mutation) => {
    localStorage[`mutableWeb:mutations:${mutation.id}`] =
      JSON.stringify(mutation);
    setUpdateCounter((counter) => counter + 1);
    return getMutationById(mutation.id);
  }, []);

  const updateMutation = useCallback((mutation) => {
    localStorage[`mutableWeb:mutations:${mutation.id}`] = JSON.stringify(mutation);
    setUpdateCounter((counter) => counter + 1);
    return getMutationById(mutation.id);
  }, []);

  const deleteMutation = useCallback((mutationId) => {
    delete localStorage[`mutableWeb:mutations:${mutationId}`];
    setUpdateCounter((counter) => counter + 1);
  }, []);

  return {
    mutations,
    getAllMutations,
    getMutationById,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
