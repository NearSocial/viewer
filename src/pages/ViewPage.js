import React, { useEffect, useState } from "react";
import { Widget } from "../components/Widget/Widget";
import { useParams } from "react-router-dom";
import { useQuery } from "../data/utils";

export default function ViewPage(props) {
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || props.widgets.default;
  const setWidgetSrc = props.setWidgetSrc;
  const viewSourceWidget = props.widgets.viewSource;

  useEffect(() => {
    setWidgetProps(Object.fromEntries([...query.entries()]));
  }, [query]);

  useEffect(() => {
    setTimeout(() => {
      setWidgetSrc(
        src === viewSourceWidget && query.get("src")
          ? {
              edit: query.get("src"),
              view: null,
            }
          : {
              edit: src,
              view: src,
            }
      );
      analytics("view", {
        props: {
          widget: src,
        },
      });
    }, 1);
  }, [src, query, setWidgetSrc, viewSourceWidget]);

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
