import React from "react";
import { DesktopNavigation } from "./desktop/DesktopNavigation";

export function NavigationWrapper(props) {
  return (
    <>
      <DesktopNavigation {...props} />
      <div style={{ height: "120px" }} />
    </>
  );
}
