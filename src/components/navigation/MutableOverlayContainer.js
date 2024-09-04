import React from "react";
import { MiniOverlay, AppSwitcher } from "mutable-web-engine";
import {
  useMutableWeb,
  useMutationApp,
} from "../../contexts/mutable-web-context";

function AppSwitcherContainer({ app }) {
  const { enableApp, disableApp, isLoading } = useMutationApp(app.id);
  return (
    <AppSwitcher
      app={app}
      enableApp={enableApp}
      disableApp={disableApp}
      isLoading={isLoading}
    />
  );
}

function MutableOverlayContainer() {
  const { selectedMutation, mutationApps } = useMutableWeb();
  return (
    <MiniOverlay baseMutation={selectedMutation} mutationApps={mutationApps}>
      {mutationApps.map((app) => (
        <AppSwitcherContainer key={app.id} app={app} />
      ))}
    </MiniOverlay>
  );
}
export default MutableOverlayContainer;
