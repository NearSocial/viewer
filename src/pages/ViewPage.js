import React, { useEffect, useState } from "react";
import { Widget } from "../components/Widget/Widget";
import { useParams } from "react-router-dom";
import { useQuery } from "../data/utils";
import { NearConfig } from "../data/near";

export default function ViewPage(props) {
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || NearConfig.widgets.default;
  const setWidgetSrc = props.setWidgetSrc;

  useEffect(() => {
    setWidgetProps(Object.fromEntries([...query.entries()]));
  }, [query]);

  useEffect(() => {
    setTimeout(() => {
      setWidgetSrc(
        src === NearConfig.widgets.viewSource && query.get("src")
          ? {
              edit: query.get("src"),
              view: null,
            }
          : {
              edit: src,
              view: src,
            }
      );
    }, 1);
  }, [src, query, setWidgetSrc]);

  return (
    <div className="container">
      <div className="row">
        <div className="d-inline-block position-relative overflow-hidden">
          <Widget key={src} src={src} props={widgetProps} />{" "}
        </div>
      </div>
    </div>
  );
}
