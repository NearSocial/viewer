import React, { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Menu } from "./Menu";
import { useLocation } from "react-router-dom";
import useScrollBlock from ".././../../hooks/useScrollBlock";

export function MobileNavigation(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
    setShowMenu(false);
    getCurrentPage();
    allowScroll();
  }, [location.pathname]);

  const getCurrentPage = () => {
    switch (location.pathname) {
      case "/":
        return setCurrentPage("Home");
      case `/${props.NearConfig.widgets.profilePage}`:
        return setCurrentPage("Profile");
      case "/edit":
        return setCurrentPage("Create");
      default:
        return setCurrentPage("");
    }
  };

  return (
    <>
      <Navigation
        {...props}
        currentPage={currentPage}
        onClickShowMenu={() => {
          setShowMenu(true);
          blockScroll();
        }}
      />
      <Menu
        {...props}
        showMenu={showMenu}
        onCloseMenu={() => {
          setShowMenu(false);
          allowScroll();
        }}
      />
    </>
  );
}
