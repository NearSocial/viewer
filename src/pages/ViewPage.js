import React, { useEffect, useState } from "react";
import { Widget } from "../components/Widget/Widget";
import { useParams } from "react-router-dom";
import { useQuery } from "../data/utils";
import { NearConfig } from "../data/near";

export default function ViewPage(props) {
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || NearConfig.defaultWidget;
  const setWidgetSrc = props.setWidgetSrc;

  useEffect(() => {
    setWidgetProps(
      [...query.entries()].reduce((props, [key, value]) => {
        props[key] = value;
        return props;
      }, {})
    );
  }, [query]);

  useEffect(() => {
    setTimeout(() => {
      setWidgetSrc(
        src === NearConfig.viewSourceWidget && query.get("src")
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
          <Widget src={src} props={widgetProps} />{" "}
        </div>
      </div>
    </div>
  );
}
