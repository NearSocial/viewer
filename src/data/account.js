import { singletonHook } from "react-singleton-hook";
import { useEffect, useState } from "react";
import { useNearPromise } from "./near";
import { keysToCamel } from "./utils";

const defaultAccount = {
  loading: true,
  accountId: null,
  state: null,
  near: null,
};

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
    const [rawStorage, writePermission, state] = await Promise.all([
      near.contract.storage_balance_of({
        account_id: accountId,
      }),
      near.contract.is_write_permission_granted({
        predecessor_id: accountId,
        key: `${accountId}`,
      }),
      near.account.state(),
    ]);
    account.storage = keysToCamel(rawStorage);
    account.writePermission = writePermission;
    account.state = state;
  }

  setAccount(account);
};

export const useAccount = singletonHook(defaultAccount, () => {
  const [account, setAccount] = useState(defaultAccount);
  const _near = useNearPromise();

  useEffect(() => {
    _near.then(async (near) => {
      try {
        await loadAccount(near, setAccount);
      } catch (e) {
        console.error(e);
      }
    });
  }, [_near]);

  return account;
});
