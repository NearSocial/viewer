import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MutationContext } from "./MutationContext";
import { useMutationContract } from "./useMutationContract";
import { useMutationLocalStorage } from "./useMutationLocalStorage";
import { useSocialDb } from "./useSocialDb";
import { useAccount, useNear } from "near-social-vm";

export const MutationProvider = ({ children }) => {
  const {
    mutations: remoteMutations,
    createMutation: createRemoteMutation,
    updateMutation: updateRemoteMutation,
    getMutationById: getRemoteMutationById,
  } = useMutationContract();

  const {
    mutations: localMutations,
    createMutation: createLocalMutation,
    updateMutation: updateLocalMutation,
    deleteMutation: deleteLocalMutation,
  } = useMutationLocalStorage();

  const { searchComponents } = useSocialDb();
  const account = useAccount();
  const near = useNear();

  const [isPickingMode, setIsPickingMode] = useState(false);
  const [pickedComponent, setPickedComponent] = useState(null);

  const [selectedMutationId, setSelectedMutationId] = useState(
    localStorage["mutableWeb:defaultMutationId"]
  );

  const [defaultMutationId, setDefaultMutationId] = useState(
    localStorage["mutableWeb:defaultMutationId"]
  );

  const [mutations, setMutations] = useState([]);

  useEffect(() => {
    const mutations = JSON.parse(
      JSON.stringify(
        remoteMutations.map((mutation) => ({ ...mutation, isLocal: false }))
      )
    );

    // Merge local and remote mutations
    for (const localMutation of localMutations) {
      const publishedMutation = mutations.find(
        (mutation) => mutation.id === localMutation.id
      );
      if (publishedMutation) {
        publishedMutation.isEdited =
          localMutation.isEdited === false ? false : true;
        publishedMutation.overrides = localMutation.overrides;
      } else {
        mutations.push({ ...localMutation, isLocal: true });
      }
    }

    setMutations(mutations);
  }, [remoteMutations, localMutations]);

  const selectedMutation = useMemo(
    () => mutations.find((mutation) => mutation.id === selectedMutationId),
    [selectedMutationId, mutations]
  );

  // Memoized overrides map for the VM
  // To prevent unnecessary rerendering we use JSON.stringify to compare overrides
  const overrides = useMemo(() => {
    if (!selectedMutation) return {};
    return Object.fromEntries(
      selectedMutation.overrides.map(({ from, to }) => {
        if (typeof to === "string") {
          return [from, to];
        } else {
          const layoutManager = {
            src: "dapplets.near/widget/LayoutManager",
            props: {
              components: to.map((compId) => ({ src: compId, props: {} })),
            },
          };

          return [from, layoutManager];
        }
      })
    );
  }, [JSON.stringify(selectedMutation?.overrides)]);

  const selectMutation = (mutationId) => {
    setSelectedMutationId(mutationId);
    if (!mutationId) {
      selectDefaultMutation(null);
    }
  };

  const selectDefaultMutation = (mutationId) => {
    setDefaultMutationId(mutationId);
    localStorage["mutableWeb:defaultMutationId"] = mutationId;
  };

  const handleWrapperClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    let target = event.target;

    while (target && !target.getAttribute("data-component")) {
      target = target.parentElement;
    }

    const componentId = target ? target.getAttribute("data-component") : null;

    setPickedComponent(componentId);
    setIsPickingMode(false);
  };

  const enablePickingMode = () => {
    setIsPickingMode(true);
    setPickedComponent(null);
  };

  const publishLocalMutation = async (localMutationId) => {
    if (!account?.accountId) return;

    const isMutationPublished = remoteMutations.some(
      (mutation) => mutation.id === localMutationId
    );
    const localMutation = localMutations.find(
      (mutation) => mutation.id === localMutationId
    );

    if (isMutationPublished) {
      updateLocalMutation({ ...localMutation, isEdited: false });
      return updateRemoteMutation(localMutation);
    } else {
      const authorId = account.accountId;
      const id = `${authorId}/${localMutation.mutationId}`;
      const newMutation = { ...localMutation, id, authorId, isEdited: false };
      createLocalMutation(newMutation);
      selectMutation(id);
      deleteLocalMutation(localMutation.id);
      return createRemoteMutation(newMutation);
    }
  };

  const proposeToRemoteMutation = useCallback(
    async (mutation) => {
      if (!near.accountId) return;
      if (!mutation.authorId.endsWith(".sputnik-dao.near")) return;

      await near.functionCall(
        mutation.authorId,
        "add_proposal",
        {
          proposal: {
            description:
              "I propose to include the following overrides for your mutation." +
              "$$$$$$$$ProposeCustomFunctionCall",
            kind: {
              FunctionCall: {
                receiver_id: "mutations.dapplets.near",
                actions: [
                  {
                    method_name: "update_mutation",
                    args: btoa(
                      JSON.stringify({
                        author_id: mutation.authorId,
                        mutation_id: mutation.mutationId,
                        overrides: mutation.overrides.map((override) => ({
                          from_src: override.from,
                          to_src: override.to,
                        })),
                      })
                    ),
                    deposit: "0",
                    gas: "150000000000000",
                  },
                ],
              },
            },
          },
        },
        undefined, // default gas
        "100000000000000000000000" // 1 near deposit
      );
    },
    [near]
  );

  const revertLocalChanges = (mutationId) => {
    deleteLocalMutation(mutationId);
  };

  const state = {
    selectedMutation,
    overrides,
    defaultMutationId,
    mutations,
    pickedComponent,
    isPickingMode,
    selectMutation,
    selectDefaultMutation,
    searchComponents,
    createLocalMutation,
    updateLocalMutation,
    deleteLocalMutation,
    enablePickingMode,
    publishLocalMutation,
    proposeToRemoteMutation,
    revertLocalChanges,
  };

  return (
    <MutationContext.Provider value={state}>
      <div
        onClick={isPickingMode ? handleWrapperClick : undefined}
        className={isPickingMode ? "component-picker" : undefined}
      >
        {children}
      </div>
    </MutationContext.Provider>
  );
};
