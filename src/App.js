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
  useNear,
} from "./data/near";
import EditorPage from "./pages/EditorPage";
import ViewPage from "./pages/ViewPage";
import { setupModal } from "@near-wallet-selector/modal-ui";
import Big from "big.js";
import EmbedPage from "./pages/EmbedPage";
import Logo from "./images/near_social_combo.svg";

export const refreshAllowanceObj = {};

function App(props) {
  const [connected, setConnected] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [availableStorage, setAvailableStorage] = useState(null);
  const [widgetSrc, setWidgetSrc] = useState(null);
  const [walletModal, setWalletModal] = useState(null);

  const near = useNear();

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
    setWalletModal(
      setupModal(near.selector, { contractId: NearConfig.contractName })
    );
  }, [near]);

  const requestSignIn = useCallback(
    (e) => {
      e && e.preventDefault();
      walletModal.show();
      return false;
    },
    [walletModal]
  );

  const withdrawStorage = useCallback(
    async (e) => {
      e && e.preventDefault();
      await near.contract.storage_withdraw({}, TGas.mul(30).toFixed(0), "1");
      return false;
    },
    [near]
  );

  const logOut = useCallback(async () => {
    if (!near) {
      return;
    }
    const wallet = await near.selector.wallet();
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
    await requestSignIn();
  }, [logOut, requestSignIn]);
  refreshAllowanceObj.refreshAllowance = refreshAllowance;

  useEffect(() => {
    if (!near) {
      return;
    }
    setSignedIn(!!near.accountId);
    setSignedAccountId(near.accountId);
    setAvailableStorage(
      near.storageBalance
        ? Big(near.storageBalance.available).div(StorageCostPerByte)
        : Big(0)
    );
    setConnected(true);
  }, [near]);

  const passProps = {
    refreshAllowance: () => refreshAllowance(),
    setWidgetSrc,
    signedAccountId,
    signedIn,
    connected,
  };

  const header = !connected ? (
    <div>
      Connecting...{" "}
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      />
    </div>
  ) : signedIn ? (
    <div>
      <button
        className="btn btn-outline-dark m-1 border-0"
        onClick={(e) => withdrawStorage(e)}
        title={`Withdraw all available storage`}
      >
        Available {availableStorage && availableStorage.div(1000).toFixed(2)}kb
      </button>
      <button className="btn btn-outline-dark m-1" onClick={(e) => logOut(e)}>
        Sign out {signedAccountId}
      </button>
    </div>
  ) : (
    <div>
      <button
        className="btn btn-outline-dark m-1"
        onClick={(e) => requestSignIn(e)}
      >
        Sign in with NEAR Wallet
      </button>
    </div>
  );
  const nav = (
    <nav className="navbar navbar-expand-lg bg-light mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" title="Near Social">
          <img
            src={Logo}
            alt="Near Social logo horizontal"
            height="24"
            className="d-inline-block align-text-top me-2"
          />
          {!IsMainnet && "Testnet"}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-lg-0">
            <li className="nav-item">
              <Link
                className="btn btn-outline-dark border-0 m-1"
                aria-current="page"
                to="/edit/new"
              >
                New widget
              </Link>
            </li>
            {widgetSrc?.edit && (
              <li className="nav-item">
                <Link
                  className="btn btn-outline-dark border-0 m-1"
                  aria-current="page"
                  to={`/edit/${widgetSrc.edit}`}
                >
                  {widgetSrc.edit.startsWith(`${signedAccountId}/widget/`)
                    ? "Edit widget"
                    : "Fork widget"}
                </Link>
              </li>
            )}
            {widgetSrc?.view && (
              <li className="nav-item">
                <Link
                  className="btn btn-outline-dark border-0 m-1"
                  aria-current="page"
                  to={`/${NearConfig.viewSourceWidget}?src=${widgetSrc?.view}`}
                >
                  View source
                </Link>
              </li>
            )}
          </ul>
          <form className="d-flex">{header}</form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path={"/embed/:widgetSrc*"}>
            <EmbedPage {...passProps} />
          </Route>
          <Route path={"/edit/:widgetSrc*"}>
            <>
              {nav}
              <EditorPage {...passProps} />
            </>
          </Route>
          <Route path={"/:widgetSrc*"}>
            <>
              {nav}
              <ViewPage {...passProps} />
            </>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
