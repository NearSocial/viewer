import React from "react";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function ProposePage(props) {
  const redirectMapStore = useBosLoaderStore();
  return (
    <div className="h-100">
      <Widget
        src="buildhub.near/widget/propose"
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
