import React from "react";
import { UserDropdown } from "../components/navigation/UserDropdown";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../stores/bos-loader";
import OnboardingFlow from "../components/OnboardingFlow";

export default function JoinPage(props) {
  const redirectMapStore = useBosLoaderStore();

  const CurrentView = props.signedIn
    ? "buildhub.near/widget/app"
    : "buildhub.near/widget/login";

  return (
    <>
      <OnboardingFlow signedIn={props.signedIn} />
      <div className="h-100">
        <Widget
          src={CurrentView}
          props={{
            ...props
          }}
          config={{
            redirectMap: redirectMapStore.redirectMap
          }}
        />
      </div>
    </>
  );
}
