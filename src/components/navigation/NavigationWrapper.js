import React, { useState, useEffect } from "react";
import { DesktopNavigation } from "./desktop/DesktopNavigation";
import { MobileNavigation } from "./mobile/MobileNavigation";

export function NavigationWrapper(props) {
  return (
    <>
      <DesktopNavigation {...props} />
      <div style={{ height: "70px" }} />
    </>
  );
}
