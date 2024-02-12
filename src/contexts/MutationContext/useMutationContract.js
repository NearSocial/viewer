import { useNear } from "near-social-vm";
import { useCallback, useEffect, useState } from "react";

const CONTRACT_ADDRESS = "mutations.dapplets.near";

const EXCLUDED_MUTATION_IDS = [
  "dapplets.near/community",
  "alsakhaev.near/nft-everywhere",
  "alsakhaev.near/red-mutation",
  // "alsakhaev.near/red-buttons",
  "dapplets.near/CatsAndDislike",
  "dapplets.near/CatsInsteadOfPosts",
  "dapplets.near/CatsAreEverywhere",
  "dapplets.near/TestMutation1",
  "dapplets.near/TestMutation2",
  "dapplets.near/TestMutation3",
  "dapplets.near/TestMutation4",
];

const convertOverridesToContract = (overrides) => {
  const converted = [];

  for (const { from, to: toOrArray } of overrides) {
    if (typeof toOrArray === "string") {
      converted.push({ from_src: from, to_src: toOrArray });
    } else {
      for (const to of toOrArray) {
        converted.push({ from_src: from, to_src: to });
      }
    }
  }

  return converted;
};

const convertOverridesFromContract = (overrides) => {
  const overridesMap = new Map();

  for (const { from_src: from, to_src: to } of overrides) {
    if (!overridesMap.has(from)) {
      overridesMap.set(from, [to]);
    } else {
      overridesMap.get(from).push(to);
    }
  }

  return Array.from(overridesMap.entries()).map(([from, to]) => ({ from, to }));
};

export const useMutationContract = () => {
  const near = useNear();

  // ***** STATE *****

  const [mutations, setMutations] = useState([]);

  useEffect(() => {
    getAllMutations().then(setMutations);
  }, [near]);

  // ***** VIEW *****

  const getAllMutations = useCallback(async () => {
    if (!near) return [];

    const mutations = await near.viewCall(
      CONTRACT_ADDRESS,
      "get_all_mutations"
    );

    return mutations
      .map((mutation) => ({
        id: mutation[0] + "/" + mutation[1],
        authorId: mutation[0],
        mutationId: mutation[1],
        title: mutation[2].description,
        overrides: convertOverridesFromContract(mutation[2].overrides),
        isLocal: false,
      }))
      .filter((mutation) => !EXCLUDED_MUTATION_IDS.includes(mutation.id));
  }, [near]);

  const getMutationById = useCallback(
    async (id) => {
      if (!near) return null;

      const [authorId, mutationId] = id.split("/");
      const mutation = await near.viewCall(CONTRACT_ADDRESS, "get_mutation", {
        mutation_id: mutationId,
        author_id: authorId,
      });

      if (!mutation) return null;

      return {
        id,
        authorId,
        mutationId,
        title: mutation.description,
        overrides: convertOverridesFromContract(mutation.overrides),
        isLocal: false,
      };
    },
    [near]
  );

  // ***** CALL *****

  const createMutation = useCallback(
    async (mutation) => {
      if (!near.accountId) return;

      // ToDo: refactor getting of mutation id
      const mutationId = mutation.id.includes("/")
        ? mutation.id.split("/")[1]
        : mutation.id;

      const globalId = `${near.accountId}/${mutationId}`;

      await near.functionCall(CONTRACT_ADDRESS, "create_mutation", {
        author_id: near.accountId,
        mutation_id: mutationId,
        description: mutation.title,
        overrides: convertOverridesToContract(mutation.overrides),
      });

      return getMutationById(globalId);
    },
    [near]
  );

  const updateMutation = useCallback(
    async (mutation) => {
      if (!near.accountId) return;
      if (!mutation.id.includes("/")) return;

      const [authorId, mutationId] = mutation.id.split("/");
      await near.functionCall(CONTRACT_ADDRESS, "update_mutation", {
        author_id: authorId,
        mutation_id: mutationId,
        description: mutation.title,
        overrides: mutation.overrides
          ? convertOverridesToContract(mutation.overrides).filter(
              (override) => override.to_src
            )
          : null,
      });

      return getMutationById(mutation.id);
    },
    [near]
  );

  return {
    mutations,
    getAllMutations,
    getMutationById,
    createMutation,
    updateMutation,
  };
};
