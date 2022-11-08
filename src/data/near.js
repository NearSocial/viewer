import * as nearAPI from "near-api-js";
import { singletonHook } from "react-singleton-hook";
import Big from "big.js";
import { refreshAllowanceObj } from "../App";
import { useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import ls from "local-storage";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

export const TGas = Big(10).pow(12);
export const MaxGasPerTransaction = TGas.mul(300);
export const StorageCostPerByte = Big(10).pow(19);

export const randomPublicKey = nearAPI.utils.PublicKey.from(
  "ed25519:8fWHD35Rjd78yeowShh9GwhRudRtLLsGCRjZtgPjAtw9"
);

const MainnetDomains = {
  "view.social08.org": true,
  "near.social": true,
  "social.near.page": true,
  localhost: true,
};

const EnableWeb4FastRpc = false;

export const IsMainnet = window.location.hostname in MainnetDomains;
const TestnetContract = "v1.social08.testnet";
const TestNearConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  archivalNodeUrl: "https://rpc.testnet.internal.near.org",
  contractName: TestnetContract,
  walletUrl: "https://wallet.testnet.near.org",
  storageCostPerByte: StorageCostPerByte,
  wrapNearAccountId: "wrap.testnet",
  defaultWidget: "eugenethedream/widget/Welcome",
  viewSourceWidget: "eugenethedream/widget/WidgetSource",
  widgetMetadataEditor: "eugenethedream/widget/WidgetMetadataEditor",
  widgetMetadata: "eugenethedream/widget/WidgetMetadata",
  apiUrl: null,
};
const MainnetContract = "social.near";
export const MainNearConfig = {
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
  archivalNodeUrl: "https://rpc.mainnet.internal.near.org",
  contractName: MainnetContract,
  walletUrl: "https://wallet.near.org",
  storageCostPerByte: StorageCostPerByte,
  wrapNearAccountId: "wrap.near",
  defaultWidget: "mob.near/widget/Homepage",
  viewSourceWidget: "mob.near/widget/WidgetSource",
  widgetMetadataEditor: "mob.near/widget/WidgetMetadataEditor",
  widgetMetadata: "mob.near/widget/WidgetMetadata",
  apiUrl: "https://api.near.social",
};

export const NearConfig = IsMainnet ? MainNearConfig : TestNearConfig;

export const LsKey = NearConfig.contractName + ":v01:";

const ApiEnabled = IsMainnet;
const SupportedApiMethods = {
  get: true,
  keys: true,
};

const apiCall = async (methodName, args, blockId, fallback) => {
  if (!ApiEnabled || !(methodName in SupportedApiMethods)) {
    return fallback();
  }
  args = args || {};

  if (blockId) {
    args.blockHeight = blockId;
  }

  try {
    return await (
      await fetch(`${NearConfig.apiUrl}/${methodName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      })
    ).json();
  } catch (e) {
    console.log("API call failed", methodName, args);
    console.error(e);
    return fallback();
  }
};

async function functionCall(
  near,
  contractName,
  methodName,
  args,
  gas,
  deposit
) {
  try {
    const wallet = await near.selector.wallet();
    return await wallet.signAndSendTransaction({
      receiverId: contractName,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName,
            args,
            gas: gas ?? TGas.mul(30).toFixed(0),
            deposit: deposit ?? "0",
          },
        },
      ],
    });
  } catch (e) {
    const msg = e.toString();
    if (msg.indexOf("does not have enough balance") !== -1) {
      return await refreshAllowanceObj.refreshAllowance();
    }
    throw e;
  }
}

function setupContract(near, contractId, options) {
  const { viewMethods = [], changeMethods = [] } = options;
  const contract = {
    near,
    contractId,
  };
  viewMethods.forEach((methodName) => {
    contract[methodName] = (args) =>
      near.viewCall(contractId, methodName, args);
  });
  changeMethods.forEach((methodName) => {
    contract[methodName] = (args, gas, deposit) =>
      near.functionCall(contractId, methodName, args, gas, deposit);
  });
  return contract;
}

async function viewCall(
  provider,
  blockId,
  contractId,
  methodName,
  args,
  finality
) {
  args = args || {};
  const result = await provider.query({
    request_type: "call_function",
    account_id: contractId,
    method_name: methodName,
    args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
    block_id: blockId,
    finality,
  });

  return (
    result.result &&
    result.result.length > 0 &&
    JSON.parse(Buffer.from(result.result).toString())
  );
}

async function web4ViewCall(contractId, methodName, args, fallback) {
  if (!IsMainnet) {
    return fallback();
  }
  args = args || {};
  const url = new URL(
    `https://rpc.web4.near.page/account/${contractId}/view/${methodName}`
  );
  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(`${key}.json`, JSON.stringify(value));
    }
  });
  try {
    return await (await fetch(url.toString())).json();
  } catch (e) {
    console.log("Web4 view call failed", url.toString());
    console.error(e);
    return fallback();
  }
}

async function updateAccount(near, walletState) {
  near.connectedContractId = walletState?.contract?.contractId;
  if (
    near.connectedContractId &&
    near.connectedContractId !== NearConfig.contractName
  ) {
    const wallet = await selector.wallet();
    await wallet.signOut();
    near.connectedContractId = null;
    walletState = selector.store.getState();
  }
  near.accountId = walletState?.accounts?.[0]?.accountId;
  if (near.accountId) {
    near.publicKey = nearAPI.KeyPair.fromString(
      ls.get(
        walletState?.selectedWalletId === "meteor-wallet"
          ? `_meteor_wallet${near.accountId}:${NearConfig.networkId}`
          : `near-api-js:keystore:${near.accountId}:${NearConfig.networkId}`
      )
    ).getPublicKey();
  }

  near.storageBalance = near.accountId
    ? await near.contract.storage_balance_of({
        account_id: near.accountId,
      })
    : null;
}

async function _initNear() {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const selector = await setupWalletSelector({
    network: IsMainnet ? "mainnet" : "testnet",
    modules: [
      setupNearWallet(),
      setupMyNearWallet(),
      setupSender(),
      setupHereWallet(),
      setupMeteorWallet(),
    ],
  });

  const nearConnection = await nearAPI.connect(
    Object.assign({ deps: { keyStore } }, NearConfig)
  );
  const _near = {};
  _near.selector = selector;

  _near.nearArchivalConnection = nearAPI.Connection.fromConfig({
    networkId: NearConfig.networkId,
    provider: {
      type: "JsonRpcProvider",
      args: { url: NearConfig.archivalNodeUrl },
    },
    signer: { type: "InMemorySigner", keyStore },
  });

  _near.keyStore = keyStore;
  _near.nearConnection = nearConnection;

  const transformBlockId = (blockId) =>
    blockId === "optimistic" || blockId === "final"
      ? {
          finality: blockId,
          blockId: undefined,
        }
      : blockId !== undefined && blockId !== null
      ? {
          finality: undefined,
          blockId: parseInt(blockId),
        }
      : {
          finality: "optimistic",
          blockId: undefined,
        };

  _near.viewCall = (contractId, methodName, args, blockHeightOrFinality) => {
    const { blockId, finality } = transformBlockId(blockHeightOrFinality);
    const nearViewCall = () =>
      viewCall(
        blockId
          ? _near.nearArchivalConnection.provider
          : _near.nearConnection.connection.provider,
        blockId ?? undefined,
        contractId,
        methodName,
        args,
        finality
      );

    const fastRpcCall = () =>
      finality === "optimistic" && EnableWeb4FastRpc
        ? web4ViewCall(contractId, methodName, args, nearViewCall)
        : nearViewCall();

    return contractId === NearConfig.contractName && finality === "final"
      ? apiCall(methodName, args, blockId, fastRpcCall)
      : fastRpcCall();
  };

  _near.block = (blockHeightOrFinality) => {
    const blockQuery = transformBlockId(blockHeightOrFinality);
    const provider = blockQuery.blockId
      ? _near.nearArchivalConnection.provider
      : _near.nearConnection.connection.provider;
    return provider.block(blockQuery);
  };
  _near.functionCall = (contractName, methodName, args, gas, deposit) =>
    functionCall(_near, contractName, methodName, args, gas, deposit);

  _near.contract = setupContract(_near, NearConfig.contractName, {
    viewMethods: [
      "storage_balance_of",
      "get",
      "get_num_accounts",
      "get_accounts_paged",
      "is_write_permission_granted",
      "keys",
    ],
    changeMethods: [
      "set",
      "grant_write_permission",
      "storage_deposit",
      "storage_withdraw",
    ],
  });

  await updateAccount(_near, selector.store.getState());

  return _near;
}

const defaultNearPromise = Promise.resolve(_initNear());
export const useNearPromise = singletonHook(defaultNearPromise, () => {
  return defaultNearPromise;
});

const defaultNear = null;
export const useNear = singletonHook(defaultNear, () => {
  const [near, setNear] = useState(defaultNear);
  const _near = useNearPromise();

  useEffect(() => {
    _near.then(setNear);
  }, [_near]);

  return near;
});

const defaultAccountId = null;
export const useAccountId = singletonHook(defaultAccountId, () => {
  const [accountId, setAccountId] = useState(defaultAccountId);
  const near = useNear();

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.store.observable.subscribe(async (walletState) => {
      console.log("walletState", walletState);
      await updateAccount(near, walletState);

      setAccountId(near.accountId);
    });
  }, [near]);

  return accountId;
});
