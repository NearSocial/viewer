import React, { useMemo, useState } from "react";
import { ButtonMutationFunctionsContext } from "./ButtonMutationFunctionsContext";
import { buttonData } from "../../components/navigation/desktop/mutation/components/ButtonDropdown";

export const ButtonMutationFunctionsProvider = ({ children }) => {
  const [selectedButtonMutationFunctions, setButtonMutationFunctions] =
    useState(buttonData[0].id);
  const [buttonFunctions, setButtonFunctions] = useState(buttonData);

  const selectedButtonFunction = useMemo(
    () =>
      buttonFunctions.find(
        (button) => button.id === selectedButtonMutationFunctions
      ),
    [selectedButtonMutationFunctions, buttonFunctions]
  );

  const selectButtonFunction = (mutationId) => {
    setButtonMutationFunctions(mutationId);
  };

  const state = {
    selectedButtonFunction,
    buttonFunctions,
    selectButtonFunction,
  };

  return (
    <ButtonMutationFunctionsContext.Provider value={state}>
      {children}
    </ButtonMutationFunctionsContext.Provider>
  );
};
