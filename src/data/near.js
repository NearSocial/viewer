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
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

export const TGas = Big(10).pow(12);
export const MaxGasPerTransaction = TGas.mul(250);
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
  widgets: {
    image: "eugenethedream/widget/Image",
    default: "eugenethedream/widget/Welcome",
    viewSource: "eugenethedream/widget/WidgetSource",
    widgetMetadataEditor: "eugenethedream/widget/WidgetMetadataEditor",
    widgetMetadata: "eugenethedream/widget/WidgetMetadata",
    profileImage: "eugenethedream/widget/ProfileImage",
    notificationButton: "eugenethedream/widget/NotificationButton",
  },
  apiUrl: null,
  finalSynchronizationDelayMs: 3000,
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
  widgets: {
    image: "mob.near/widget/Image",
    default: "mob.near/widget/Homepage",
    viewSource: "mob.near/widget/WidgetSource",
    widgetMetadataEditor: "mob.near/widget/WidgetMetadataEditor",
    widgetMetadata: "mob.near/widget/WidgetMetadata",
    profileImage: "mob.near/widget/ProfileImage",
    notificationButton: "mob.near/widget/NotificationButton",
  },
  apiUrl: "https://api.near.social",
  finalSynchronizationDelayMs: 3000,
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
    const wallet = await (await near.selector).wallet();
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

async function accountState(near, accountId) {
  const account = new nearAPI.Account(
    near.nearConnection.connection,
    accountId
  );
  return await account.state();
}

async function sendTransactions(near, functionCalls) {
  try {
    const wallet = await (await near.selector).wallet();
    const transactions = [];
    let currentTotalGas = Big(0);
    functionCalls.forEach(
      ({ contractName, methodName, args, gas, deposit }) => {
        const newTotalGas = currentTotalGas.add(gas);
        const action = {
          type: "FunctionCall",
          params: {
            methodName,
            args,
            gas: gas.toFixed(0),
            deposit: deposit.toFixed(0),
          },
        };
        if (
          transactions[transactions.length - 1]?.receiverId !== contractName ||
          newTotalGas.gt(MaxGasPerTransaction)
        ) {
          transactions.push({
            receiverId: contractName,
            actions: [],
          });
          currentTotalGas = gas;
        } else {
          currentTotalGas = newTotalGas;
        }
        transactions[transactions.length - 1].actions.push(action);
      }
    );
    return await wallet.signAndSendTransactions({ transactions });
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

async function _initNear() {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const selector = setupWalletSelector({
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
  _near.sendTransactions = (transactions) =>
    sendTransactions(_near, transactions);

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

  _near.accountState = (accountId) => accountState(_near, accountId);

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
