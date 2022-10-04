import * as nearAPI from "near-api-js";
import { singletonHook } from "react-singleton-hook";
import Big from "big.js";
import { refreshAllowanceObj } from "../App";
import { useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";

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
  defaultWidget: "mob.near/widget/Welcome",
};

export const NearConfig = IsMainnet ? MainNearConfig : TestNearConfig;
export const LsKey = NearConfig.contractName + ":v01:";

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
    contract[methodName] = async (args, gas, deposit) => {
      try {
        const wallet = await near.selector.wallet();
        return await wallet.signAndSendTransaction({
          signerId: near.accountId,
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
    };
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

async function _initNear() {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const selector = await setupWalletSelector({
    network: IsMainnet ? "mainnet" : "testnet",
    modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
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

  let walletState = selector.store.getState();
  _near.connectedContractId = walletState?.contract?.contractId;
  if (
    _near.connectedContractId &&
    _near.connectedContractId !== NearConfig.contractName
  ) {
    const wallet = await selector.wallet();
    await wallet.signOut();
    _near.connectedContractId = null;
    walletState = selector.store.getState();
  }
  _near.accountId = walletState?.accounts?.[0]?.accountId;

  _near.archivalViewCall = (args) =>
    viewCall(_near.nearArchivalConnection.provider, ...args);
  _near.viewCall = (contractId, methodName, args) =>
    viewCall(
      _near.nearConnection.connection.provider,
      undefined,
      contractId,
      methodName,
      args,
      "optimistic"
    );

  _near.contract = setupContract(_near, NearConfig.contractName, {
    viewMethods: [
      "storage_balance_of",
      "get",
      "get_num_accounts",
      "get_accounts_paged",
      "is_write_permission_granted",
      "keys",
    ],
    changeMethods: ["set", "grant_write_permission", "storage_deposit"],
  });

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
