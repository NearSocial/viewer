import { Widget } from "near-social-vm";
import React from "react";
import { useBosLoaderStore } from "../stores/bos-loader";

export default function ResourcesPage(props) {
    const redirectMapStore = useBosLoaderStore();

    const src = props.widgets.resources;

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
