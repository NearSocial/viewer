import React, { useEffect } from "react";
import { UserDropdown } from "../components/navigation/desktop/UserDropdown";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function JoinPage(props) {
  const redirectMapStore = useBosLoaderStore();

  const CurrentView = props.signedIn
    ? "buildhub.near/widget/create-something"
    : "buildhub.near/widget/login";

  useEffect(() => {
    if (
      props.signedIn === true &&
      CurrentView === "buildhub.near/widget/login"
    ) {
      window.location.reload();
    }
  }, [props.signedIn]);

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
