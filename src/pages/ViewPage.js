import React, { useEffect, useState } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { useHashRouterLegacy } from "../hooks/useHashRouterLegacy";
import { DesktopNavigation } from "../components/navigation/desktop/DesktopNavigation";

export default function ViewPage(props) {
  useHashRouterLegacy();

  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src =
    window?.InjectedConfig?.forcedWidget ||
    widgetSrc ||
    window?.InjectedConfig?.defaultWidget ||
    props.widgets.default;
  const showMenu = !window?.InjectedConfig?.hideMenu;
  const setWidgetSrc = props.setWidgetSrc;
  const viewSourceWidget = props.widgets.viewSource;

  const injectedProps = window?.InjectedConfig?.props;

  useEffect(() => {
    setWidgetProps(
      Object.assign(
        injectedProps || {},
        Object.fromEntries([...query.entries()])
      )
    );
  }, [query, injectedProps]);

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
    }, 1);
  }, [src, query, setWidgetSrc, viewSourceWidget]);

  return showMenu ? (
    <div className="container-xl" style={{ position: "relative" }}>
      <DesktopNavigation {...props} />
      <div className="row">
        <div className="position-relative">
          <Widget key={src} src={src} props={widgetProps} />
        </div>
      </div>
    </div>
  ) : (
    <Widget key={src} src={src} props={widgetProps} />
  );
}
