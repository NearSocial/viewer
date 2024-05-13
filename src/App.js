import React, { useCallback, useEffect, useState } from "react";
import "error-polyfill";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@near-wallet-selector/modal-ui/styles.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "App.scss";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import ViewPage from "./pages/ViewPage";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupModal } from "@near-wallet-selector/modal-ui";
import EmbedPage from "./pages/EmbedPage";
import {
  useAccount,
  useInitNear,
  useNear,
  utils,
  EthersProviderContext,
} from "near-social-vm";
import Big from "big.js";
import { NavigationWrapper } from "./components/navigation/NavigationWrapper";
import { NetworkId, Widgets } from "./data/widgets";
import { useEthersProviderContext } from "./data/web3";
import SignInPage from "./pages/SignInPage";
import { isValidAttribute } from "dompurify";
import { Engine, DappletOverlay } from "mutable-web-engine";

export const refreshAllowanceObj = {};
const documentationHref = "https://social.near-docs.io/";

const getNetworkPreset = (networkId) => {
  switch (networkId) {
    case "mainnet":
      return {
        networkId,
        nodeUrl: "https://rpc.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://nearblocks.io",
        indexerUrl: "https://api.kitwallet.app",
      };
    case "testnet":
      return {
        networkId,
        nodeUrl: "https://rpc.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://testnet.nearblocks.io",
        indexerUrl: "https://testnet-api.kitwallet.app",
      };
    default:
      throw Error(`Failed to find config for: '${networkId}'`);
  }
};

function App(props) {
  const [connected, setConnected] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [availableStorage, setAvailableStorage] = useState(null);
  const [walletModal, setWalletModal] = useState(null);
  const [mutationEngine, setMutationEngine] = useState(null);
  const [widgetSrc, setWidgetSrc] = useState(null);

  const ethersProviderContext = useEthersProviderContext();

  const { initNear } = useInitNear();
  const near = useNear();
  const account = useAccount();

  const accountId = account.accountId;

  useEffect(() => {
    const walletSelectorNetwork = getNetworkPreset(NetworkId);
    if (window.location.hostname === "near.social") {
      walletSelectorNetwork.nodeUrl = "https://rpc.fastnear.com";
    }

    const config = {
      networkId: NetworkId,
      selector: setupWalletSelector({
        network: walletSelectorNetwork,
        modules: [
          setupMintbaseWallet(),
          setupMyNearWallet(),
          setupSender(),
          setupHereWallet(),
          setupMeteorWallet(),
          setupNeth({
            gas: "300000000000000",
            bundle: false,
          }),
          setupNightly(),
        ],
      }),
      customElements: {
        Link: (props) => {
          if (!props.to && props.href) {
            props.to = props.href;
            delete props.href;
          }
          if (props.to) {
            props.to =
              typeof props.to === "string" &&
              isValidAttribute("a", "href", props.to)
                ? props.to
                : "about:blank";
          }
          return <Link {...props} />;
        },
        DappletOverlay,
      },
      config: {
        defaultFinality: undefined,
      },
      features: {
        enableComponentPropsDataKey: true,
        enableComponentSrcDataKey: true,
        skipTxConfirmationPopup: true,
      },
    };

    if (window.location.hostname === "near.social") {
      config.config.nodeUrl = "https://rpc.fastnear.com";
    }

    initNear && initNear(config);
  }, [initNear]);

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector) => {
      setWalletModal(
        setupModal(selector, { contractId: near.config.contractName })
      );
    });
  }, [near]);

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector) => {
      const engine = new Engine({
        networkId: NetworkId,
        selector: selector,
        gatewayId: "near-social",
        bosElementStyleSrc: "/bootstrap.min.css",
      });

      const mutationId = window.sessionStorage.getItem("mutableweb:mutationId");

      if (!mutationId) {
        engine.start().then(() => setMutationEngine(engine));
      } else if (mutationId !== "null") {
        engine.start(mutationId).then(() => setMutationEngine(engine));
      } else {
        setMutationEngine(engine);
      }
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
    setConnected(true);
  }, [near, accountId]);

  useEffect(() => {
    setAvailableStorage(
      account.storageBalance
        ? Big(account.storageBalance.available).div(utils.StorageCostPerByte)
        : Big(0)
    );
  }, [account]);

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
    widgets: Widgets,
    documentationHref,
    mutationEngine,
  };

  return (
    <div className="App">
      <EthersProviderContext.Provider value={ethersProviderContext}>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path={"/signin"}>
              <NavigationWrapper {...passProps} />
              <SignInPage {...passProps} />
            </Route>
            <Route path={"/embed/:widgetSrc*"}>
              <EmbedPage {...passProps} />
            </Route>
            <Route path={"/edit/:widgetSrc*"}>
              <NavigationWrapper {...passProps} />
              <EditorPage {...passProps} />
            </Route>
            <Route path={"/:widgetSrc*"}>
              <NavigationWrapper {...passProps} />
              <ViewPage {...passProps} />
            </Route>
          </Switch>
        </Router>
      </EthersProviderContext.Provider>
    </div>
  );
}

export default App;
