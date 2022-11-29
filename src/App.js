import React, { useCallback, useEffect, useState } from "react";
import "error-polyfill";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@near-wallet-selector/modal-ui/styles.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "App.scss";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import {
  IsMainnet,
  NearConfig,
  StorageCostPerByte,
  TGas,
  useAccountId,
  useNear,
} from "./data/near";
import EditorPage from "./pages/EditorPage";
import ViewPage from "./pages/ViewPage";
import { setupModal } from "@near-wallet-selector/modal-ui";
import Big from "big.js";
import EmbedPage from "./pages/EmbedPage";
import { Sidebar } from "./components/Sidebar";

export const refreshAllowanceObj = {};

function App(props) {
  const [connected, setConnected] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [availableStorage, setAvailableStorage] = useState(null);
  const [walletModal, setWalletModal] = useState(null);
  const [widgetSrc, setWidgetSrc] = useState(null);

  const near = useNear();
  const accountId = useAccountId();

  const location = window.location;

  useEffect(() => {
    if (
      !location.search.includes("?account_id") &&
      !location.search.includes("&account_id") &&
      (location.search || location.href.includes("/?#"))
    ) {
      window.history.replaceState({}, "/", "/" + location.hash);
    }
  }, [location]);

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector) => {
      setWalletModal(
        setupModal(selector, { contractId: NearConfig.contractName })
      );
    });
  }, [near]);

  const requestSignIn = useCallback(
    (e) => {
      e && e.preventDefault();
      walletModal.show();
      return false;
    },
    [walletModal]
  );

  const logOut = useCallback(async () => {
    if (!near) {
      return;
    }
    const wallet = await (await near.selector).wallet();
    wallet.signOut();
    near.accountId = null;
    setSignedIn(false);
    setSignedAccountId(null);
  }, [near]);

  const refreshAllowance = useCallback(async () => {
    alert(
      "You're out of access key allowance. Need sign in again to refresh it"
    );
    await logOut();
    requestSignIn();
  }, [logOut, requestSignIn]);
  refreshAllowanceObj.refreshAllowance = refreshAllowance;

  useEffect(() => {
    if (!near) {
      return;
    }
    setSignedIn(!!accountId);
    setSignedAccountId(accountId);
    setAvailableStorage(
      near.storageBalance
        ? Big(near.storageBalance.available).div(StorageCostPerByte)
        : Big(0)
    );
    setConnected(true);
  }, [near, accountId]);

  const passProps = {
    refreshAllowance: () => refreshAllowance(),
    setWidgetSrc,
    signedAccountId,
    signedIn,
    connected,
    availableStorage,
    widgetSrc,
    logOut,
    requestSignIn,
  };

  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path={"/embed/:widgetSrc*"}>
            <EmbedPage {...passProps} />
          </Route>
          <Route path={"/edit/:widgetSrc*"}>
            <Sidebar {...passProps}>
              <EditorPage {...passProps} />
            </Sidebar>
          </Route>
          <Route path={"/:widgetSrc*"}>
            <Sidebar {...passProps}>
              <ViewPage {...passProps} />
            </Sidebar>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
