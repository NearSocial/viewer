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

const fetchPreviousData = async (near, data) => {
  const keys = extractKeys(data);
  return await near.contract.get({
    keys,
  });
};

export const asyncCommitData = async (near, data, forceRewrite) => {
  const accountId = near.accountId;
  if (!accountId) {
    alert("You're not logged in, bro");
    return;
  }
  console.log("Committing data", data);
  const storageBalance = await near.contract.storage_balance_of({
    account_id: accountId,
  });
  const availableStorage = Big(storageBalance?.available || "0");
  data = {
    [near.accountId]: convertToStringLeaves(data),
  };
  let previousData = {};
  if (!forceRewrite) {
    previousData = await fetchPreviousData(near, data);
    data = removeDuplicates(data, previousData);
  }
  if (!data) {
    return;
  }
  const expectedDataBalance = StorageCostPerByte.mul(
    estimateDataSize(data, previousData)
  )
    .add(storageBalance ? Big(0) : InitialAccountStorageBalance)
    .add(ExtraStorageBalance);
  const deposit = bigMax(
    expectedDataBalance.sub(availableStorage),
    storageBalance ? Big(1) : MinStorageBalance
  );

  return await near.contract.set(
    {
      data,
    },
    TGas.mul(100).toFixed(0),
    deposit.toFixed(0)
  );
};
