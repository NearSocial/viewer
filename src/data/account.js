import { singletonHook } from "react-singleton-hook";
import { useEffect, useState } from "react";
import { LsKey, NearConfig, useNear } from "./near";
import ls from "local-storage";
import * as nearAPI from "near-api-js";

const LsKeyAccountId = LsKey + ":accountId:";

const defaultAccount = {
  loading: true,
  accountId: ls.get(LsKeyAccountId) ?? undefined,
  state: null,
  near: null,
};

async function updateAccount(near, walletState) {
  near.connectedContractId = walletState?.contract?.contractId;
  if (
    near.connectedContractId &&
    near.connectedContractId !== NearConfig.contractName
  ) {
    const selector = await near.selector;
    const wallet = await selector.wallet();
    await wallet.signOut();
    near.connectedContractId = null;
    walletState = selector.store.getState();
  }
  near.accountId = walletState?.accounts?.[0]?.accountId ?? null;
  if (near.accountId) {
    near.publicKey = null;
    try {
      if (walletState?.selectedWalletId === "here-wallet") {
        const hereKeystore = ls.get("herewallet:keystore");
        near.publicKey = nearAPI.KeyPair.fromString(
          hereKeystore[NearConfig.networkId].accounts[near.accountId]
        ).getPublicKey();
      }
    } catch (e) {
      console.error(e);
    }
    if (!near.publicKey) {
      try {
        near.publicKey = nearAPI.KeyPair.fromString(
          ls.get(
            walletState?.selectedWalletId === "meteor-wallet"
              ? `_meteor_wallet${near.accountId}:${NearConfig.networkId}`
              : `near-api-js:keystore:${near.accountId}:${NearConfig.networkId}`
          )
        ).getPublicKey();
      } catch (e) {
        console.error(e);
      }
    }
  }
}

const loadAccount = async (near, setAccount) => {
  const accountId = near.accountId;
  const account = {
    loading: false,
    accountId,
    state: null,
    near,
    refresh: async () => await loadAccount(near, setAccount),
  };
  if (accountId) {
    const [storageBalance, state] = await Promise.all([
      near.contract.storage_balance_of({
        account_id: accountId,
      }),
      near.accountState(accountId),
    ]);
    account.storageBalance = storageBalance;
    account.state = state;
  }

  setAccount(account);
};

export const useAccount = singletonHook(defaultAccount, () => {
  const [account, setAccount] = useState(defaultAccount);
  const near = useNear();

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector) => {
      selector.store.observable.subscribe(async (walletState) => {
        await updateAccount(near, walletState);
        try {
          await loadAccount(near, setAccount);
        } catch (e) {
          console.error(e);
        }
        ls.set(LsKeyAccountId, near.accountId);
      });
    });
  }, [near]);

  return account;
});

export const useAccountId = () => {
  const account = useAccount();
  return account.accountId;
};
