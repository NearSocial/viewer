import React, { useEffect, useState } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { useHashUrlBackwardsCompatibility } from "../hooks/useHashUrlBackwardsCompatibility";

export default function EmbedPage(props) {
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || props.widgets.default;

  useHashUrlBackwardsCompatibility();

  useEffect(() => {
    setWidgetProps(
      [...query.entries()].reduce((props, [key, value]) => {
        props[key] = value;
        return props;
      }, {})
    );
  }, [query]);

  useEffect(() => {
    analytics("embed", {
      props: {
        widget: src,
      },
    });
  }, [src]);

  return (
    <div className="d-inline-block position-relative overflow-hidden">
      <Widget
        key={props.widgets.wrapper}
        src={props.widgets.wrapper}
        props={{
          children: (
            <Widget
              key={props.tos.checkComponentPath}
              src={props.tos.checkComponentPath}
              props={{
                logOut: props.logOut,
                tosName: props.tos.contentComponentPath,
                targetComponent: src,
                targetProps: widgetProps,
              }}
            />
          ),
        }}
      />
    </div>
  );
}
