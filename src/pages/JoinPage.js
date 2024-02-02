import React from "react";
import { UserDropdown } from "../components/navigation/UserDropdown";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function JoinPage(props) {
  const redirectMapStore = useBosLoaderStore();

  const CurrentView = props.signedIn
    ? "buildhub.near/widget/JoinSection"
    : "buildhub.near/widget/login";

  return (
    <div className="h-100">
      {props.signedIn && (
        <div
          className="position-absolute z-2"
          style={{ top: "3rem", right: "3rem" }}
        >
          <UserDropdown {...props} />
        </div>
      )}
      <Widget
        src={CurrentView}
        props={{
          ...props,
        }}
        config={{
          redirectMap: redirectMapStore.redirectMap,
        }}
      />
    </div>
  );
}
