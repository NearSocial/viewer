import { Widget } from "near-social-vm";
import React from "react";
import { useHashRouterLegacy } from "../hooks/useHashRouterLegacy";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function FeedPage(props) {
  useHashRouterLegacy();
  const redirectMapStore = useBosLoaderStore();

  const src = props.widgets.feed;

  return (
    <div style={{ backgroundColor: "lightgray" }}>
      <Widget
        key={src}
        src={src}
        config={{
          redirectMap: redirectMapStore.redirectMap,
        }}
      />
    </div>
  );
}
