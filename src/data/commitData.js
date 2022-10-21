import { StorageCostPerByte, TGas } from "./near";
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
  const storageBalance = await near.contract.storage_balance_of({
    account_id: accountId,
  });
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
    .add(ExtraStorageBalance);
  const deposit = bigMax(
    expectedDataBalance.sub(availableStorage),
    storageBalance ? Big(1) : MinStorageBalance
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
