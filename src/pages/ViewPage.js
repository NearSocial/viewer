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
  const setForkSrc = props.setForkSrc;

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
      setForkSrc(`/edit/${src}`);
    }, 1);
  }, [src, setForkSrc]);

  return <Widget src={src} props={widgetProps} />;
}
