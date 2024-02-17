import React from "react";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function OnboardingFlow({ signedIn }) {
  const redirectMapStore = useBosLoaderStore();

  if (signedIn) {
    return (
      <div>
        <Widget
          src={"buildhub.near/widget/OnboardingFlow"}
          config={{
            redirectMap: redirectMapStore.redirectMap,
          }}
        />
      </div>
    );
  }
}
