import React, { useState, useEffect } from "react";
import { DesktopNavigation } from "./desktop/DesktopNavigation";
import Banner from "./Banner";
import styled from "styled-components";

export function NavigationWrapper(props) {
  const hideMenu = !!window?.InjectedConfig?.hideMenu;

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );
  const [showBanner, setShowbanner] = useState(
    sessionStorage.getItem("BannerToggle") || "true"
  );
  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  return hideMenu ? (
    <></>
  ) : (
    <>
      {/* <DesktopNavigation {...props} /> */}
      {JSON.parse(showBanner) && <Banner setShowbanner={setShowbanner} />}
      {/* {!matches && <MobileNavigation {...props} />} */}
    </>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;
