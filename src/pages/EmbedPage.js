import React, { useEffect, useState } from "react";
import { Widget } from "../components/Widget/Widget";
import { useParams } from "react-router-dom";
import { useQuery } from "../data/utils";
import { NearConfig } from "../data/near";

export default function EmbedPage(props) {
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || NearConfig.widgets.default;

  useEffect(() => {
    setWidgetProps(
      [...query.entries()].reduce((props, [key, value]) => {
        props[key] = value;
        return props;
      }, {})
    );
  }, [query]);

  return (
    <div className="d-inline-block position-relative overflow-hidden">
      <Widget src={src} props={widgetProps} />{" "}
    </div>
  );
}
