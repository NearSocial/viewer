import React, { useEffect } from "react";
import { Widget } from "../components/Widget/Widget";
import { useParams } from "react-router-dom";

export default function ViewPage(props) {
  const { widgetSrc } = useParams();
  const src = widgetSrc || "eugenethedream/widget/Welcome";
  const setForkSrc = props.setForkSrc;

  useEffect(() => {
    setTimeout(() => {
      setForkSrc(`/edit/${src}`);
    }, 1);
  }, [src, setForkSrc]);

  return <Widget src={src} />;
}
