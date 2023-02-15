import { singletonHook } from "react-singleton-hook";
import { useEffect, useState } from "react";
import { useNear } from "./near";
import ls from "local-storage";
import * as nearAPI from "near-api-js";

export const LsKey = "near-social-vm:v01:";
const LsKeyAccountId = LsKey + ":accountId:";
const LsKeyPretendAccountId = LsKey + ":pretendAccountId:";

const defaultAccount = {
  loading: true,
  signedAccountId: ls.get(LsKeyAccountId) ?? undefined,
  pretendAccountId: ls.get(LsKeyPretendAccountId) ?? undefined,
  accountId:
    ls.get(LsKeyPretendAccountId) ?? ls.get(LsKeyAccountId) ?? undefined,
  state: null,
  near: null,
};

async function updateAccount(near, walletState) {
  near.connectedContractId = walletState?.contract?.contractId;
  if (
    near.connectedContractId &&
    near.connectedContractId !== near.config.contractName
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
          hereKeystore[near.config.networkId].accounts[near.accountId]
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
              ? `_meteor_wallet${near.accountId}:${near.config.networkId}`
              : `near-api-js:keystore:${near.accountId}:${near.config.networkId}`
          )
        ).getPublicKey();
      } catch (e) {
        console.error(e);
      }
    }
  }
}

const loadAccount = async (near, setAccount) => {
  const signedAccountId = near.accountId;
  if (signedAccountId) {
    ls.set(LsKeyAccountId, signedAccountId);
  } else {
    ls.remove(LsKeyAccountId);
  }
  const pretendAccountId = ls.get(LsKeyPretendAccountId) ?? undefined;
  const account = {
    loading: false,
    signedAccountId,
    pretendAccountId,
    accountId: pretendAccountId ?? signedAccountId,
    state: null,
    near,
    refresh: async () => await loadAccount(near, setAccount),
    startPretending: async (pretendAccountId) => {
      if (pretendAccountId) {
        ls.set(LsKeyPretendAccountId, pretendAccountId);
      } else {
        ls.remove(LsKeyPretendAccountId);
      }
      await loadAccount(near, setAccount);
    },
  };
  if (signedAccountId) {
    const [storageBalance, state] = await Promise.all([
      near.contract.storage_balance_of({
        account_id: signedAccountId,
      }),
      near.accountState(signedAccountId),
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
      });
    });
  }, [near]);

  return account;
});

export const useAccountId = () => {
  const account = useAccount();
  return account.accountId;
};
