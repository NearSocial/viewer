import { NearConfig, StorageCostPerByte, TGas } from "./near";
import {
  bigMax,
  convertToStringLeaves,
  estimateDataSize,
  extractKeys,
  removeDuplicates,
} from "./utils";
import Big from "big.js";

const MinStorageBalance = StorageCostPerByte.mul(2000);
const InitialAccountStorageBalance = StorageCostPerByte.mul(500);
const ExtraStorageBalance = StorageCostPerByte.mul(500);
const StorageForPermission = StorageCostPerByte.mul(500);

const fetchCurrentData = async (near, data) => {
  const keys = extractKeys(data);
  return await near.contract.get({
    keys,
  });
};

export const prepareCommit = async (near, originalData, forceRewrite) => {
  const accountId = near.accountId;
  if (!accountId) {
    alert("You're not logged in. Sign in to commit data.");
    return;
  }
  const [storageBalance, permissionGranted] = await Promise.all([
    near.viewCall(NearConfig.contractName, "storage_balance_of", {
      account_id: accountId,
    }),
    near.publicKey
      ? near.viewCall(NearConfig.contractName, "is_write_permission_granted", {
          public_key: near.publicKey.toString(),
          key: accountId,
        })
      : Promise.resolve(false),
  ]);
  const availableStorage = Big(storageBalance?.available || "0");
  let data = {
    [near.accountId]: convertToStringLeaves(originalData),
  };
  let currentData = {};
  if (!forceRewrite) {
    currentData = await fetchCurrentData(near, data);
    data = removeDuplicates(data, currentData);
  }
  const expectedDataBalance = StorageCostPerByte.mul(
    estimateDataSize(data, currentData)
  )
    .add(storageBalance ? Big(0) : InitialAccountStorageBalance)
    .add(permissionGranted ? Big(0) : StorageForPermission)
    .add(ExtraStorageBalance);
  const deposit = bigMax(
    expectedDataBalance.sub(availableStorage),
    permissionGranted ? Big(0) : storageBalance ? Big(1) : MinStorageBalance
  );
  return {
    originalData,
    accountId,
    storageBalance,
    availableStorage,
    currentData,
    data,
    expectedDataBalance,
    deposit,
    permissionGranted,
  };
};

export const asyncCommit = async (near, data, deposit) => {
  console.log("Committing data", data);

  return await near.contract.set(
    {
      data,
    },
    TGas.mul(100).toFixed(0),
    deposit.toFixed(0)
  );
};

export const asyncCommitData = async (near, originalData, forceRewrite) => {
  const { data, deposit } = await prepareCommit(
    near,
    originalData,
    forceRewrite
  );
  return asyncCommit(near, data, deposit);
};

export const requestPermissionAndCommit = async (near, data, deposit) => {
  const wallet = await (await near.selector).wallet();
  const actions = [];
  if (near.publicKey) {
    actions.push({
      type: "FunctionCall",
      params: {
        methodName: "grant_write_permission",
        args: {
          public_key: near.publicKey.toString(),
          keys: [near.accountId],
        },
        gas: TGas.mul(100).toFixed(0),
        deposit: deposit.gt(0) ? deposit.toFixed(0) : "1",
      },
    });
  }
  actions.push({
    type: "FunctionCall",
    params: {
      methodName: "set",
      args: {
        data,
      },
      gas: TGas.mul(100).toFixed(0),
      deposit: "1",
    },
  });
  return await wallet.signAndSendTransaction({
    receiverId: NearConfig.contractName,
    actions,
  });
};
