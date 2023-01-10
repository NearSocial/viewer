import React, { useState } from "react";
import { Navigation } from "./Navigation";
import { Menu } from "./Menu";

export function MobileNavigation(props) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <Navigation
        {...props}
        showMenu={showMenu}
        onClickShowMenu={() => setShowMenu(true)}
      />
      <Menu
        {...props}
        showMenu={showMenu}
        onClickCloseMenu={() => setShowMenu(false)}
      />
    </>
  );
}
