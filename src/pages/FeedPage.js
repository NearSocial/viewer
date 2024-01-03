import { Widget } from "near-social-vm";
import React from "react";
import { useHashRouterLegacy } from "../hooks/useHashRouterLegacy";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function FeedPage(props) {
  useHashRouterLegacy();
  const redirectMapStore = useBosLoaderStore();

  const src = props.widgets.feed;

  return (
    <div className="container-xl mt-3" style={{ backgroundColor: "#0b0c14" }}>
      <Widget
        key={src}
        src={src}
        config={{
          redirectMap: redirectMapStore.redirectMap,
        }}
        props={props}
      />
    </div>
  );
}
