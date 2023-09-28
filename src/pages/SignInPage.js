import React, { useCallback, useEffect, useState } from "react";
import { Widget } from "near-social-vm";
import { useHistory } from "react-router-dom";
import * as nearAPI from "near-api-js";
import { NetworkId } from "../data/widgets";
import ls from "local-storage";

const WalletSelectorDefaultValues = {
  "near-wallet-selector:selectedWalletId": "near-wallet",
  "near-wallet-selector:recentlySignedInWallets": ["near-wallet"],
  "near-wallet-selector:contract": {
    contractId: NetworkId === "testnet" ? "v1.social08.testnet" : "social.near",
    methodNames: [],
  },
};

const WalletSelectorAuthKey = "near_app_wallet_auth_key";

export default function SignInPage(props) {
  const [params, setParams] = useState({});
  const history = useHistory();

  useEffect(() => {
    const currentUrl = window.location.href;

    if (currentUrl.includes("#")) {
      const path = currentUrl.split("#")[1];
      const query = new URLSearchParams(path);
      setParams({
        accountId: query.get("a"),
        privateKey: query.get("k"),
      });
    }
  }, []);

  const localSignIn = useCallback(async () => {
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const keyPair = nearAPI.KeyPair.fromString(params.privateKey);
    await keyStore.setKey(NetworkId, params.accountId, keyPair);
    Object.entries(WalletSelectorDefaultValues).forEach(([key, value]) => {
      ls.set(key, value);
    });
    ls.set(WalletSelectorAuthKey, {
      accountId: params.accountId,
      allKeys: [keyPair.publicKey.toString()],
    });
    window.location.href = "/";
  }, [params.accountId, params.privateKey]);

  return (
    <div className="container-xl">
      <div className="row">
        <div
          className="d-inline-block position-relative overflow-hidden"
          style={{
            "--body-top-padding": "24px",
            paddingTop: "var(--body-top-padding)",
          }}
        >
          <h3>Sign in as</h3>
          <div className="mt-2">
            <Widget
              src={props.widgets.profileInlineBlock}
              props={{ accountId: params.accountId }}
            />
          </div>
          <div className="mt-4 d-flex gap-2">
            <button
              className="btn btn-lg w-100 btn-success"
              onClick={() => localSignIn()}
            >
              Sign In
            </button>
            <button
              className="btn btn-lg w-100 btn-danger"
              onClick={() => {
                history.push("/");
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
