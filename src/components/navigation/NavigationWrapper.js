import React from "react";
import { DesktopNavigation } from "./desktop/DesktopNavigation";
import { MobileNavigation } from "./mobile/MobileNavigation";

export function NavigationWrapper(props) {
  return (
    <>
      <MobileNavigation {...props} />
      {/* <DesktopNavigation {...props} /> */}
      <div style={{ height: "120px" }} />
    </>
  );
}
