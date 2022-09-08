import React, { useCallback, useEffect, useState } from "react";
import "error-polyfill";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@near-wallet-selector/modal-ui/styles.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./App.scss";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { IsMainnet, NearConfig, useNear } from "./data/near";
import EditorPage from "./pages/EditorPage";
import ViewPage from "./pages/ViewPage";
import { setupModal } from "@near-wallet-selector/modal-ui";

export const refreshAllowanceObj = {};

function App(props) {
  const [connected, setConnected] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [forkSrc, setForkSrc] = useState(null);
  const [walletModal, setWalletModal] = useState(null);

  const near = useNear();

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
    setConnected(true);
  }, [near]);

  const passProps = {
    refreshAllowance: () => refreshAllowance(),
    setForkSrc,
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
      <button className="btn btn-outline-light" onClick={() => logOut()}>
        Sign out {signedAccountId}
      </button>
    </div>
  ) : (
    <div>
      <button
        className="btn btn-outline-light"
        onClick={(e) => requestSignIn(e)}
      >
        Sign in with NEAR Wallet
      </button>
    </div>
  );

  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
          <div className="container-fluid">
            <a className="navbar-brand" href="/" title="viewer">
              <img
                src="/favicon.png"
                alt="viewer logo"
                height="24"
                className="d-inline-block align-text-top me-2"
              />
              viewer
            </a>
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/">
                    {IsMainnet ? "Main" : "Testnet"}
                  </Link>
                </li>
                {forkSrc && (
                  <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to={forkSrc}>
                      Fork widget
                    </Link>
                  </li>
                )}
              </ul>
              <form className="d-flex">{header}</form>
            </div>
          </div>
        </nav>

        <Switch>
          <Route path={"/edit/:widgetSrc*"}>
            <EditorPage {...passProps} />
          </Route>
          <Route path={"/:widgetSrc*"}>
            <ViewPage {...passProps} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
