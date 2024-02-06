import React from "react";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function OnboardingFlow() {
  const redirectMapStore = useBosLoaderStore();

  return (
    <div>
      <Widget
        src={"buildhub.near/widget/OnboardingFlow"}
        config={{
          redirectMap: redirectMapStore.redirectMap
        }}
      />
    </div>
  );
}
