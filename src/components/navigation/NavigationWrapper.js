import React, { useState, useEffect } from "react";
import { DesktopNavigation } from "./desktop/DesktopNavigation";

export function NavigationWrapper(props) {
  return (
    <>
      <DesktopNavigation {...props} />
    </>
  );
}
