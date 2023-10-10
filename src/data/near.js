import ls from "local-storage";
import * as nearAPI from "near-api-js";
import { NetworkId } from "./widgets";

export async function getSocialKeyPair(accountId) {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const keyPair = await keyStore.getKey(NetworkId, accountId);
  if (keyPair) {
    return keyPair;
  }

  try {
    const hereKeystore = ls.get("herewallet:keystore");
    if (hereKeystore) {
      return nearAPI.KeyPair.fromString(
        hereKeystore[NetworkId].accounts[accountId]
      );
    }
  } catch {}

  try {
    const meteorKey = ls.get(`_meteor_wallet${accountId}:${NetworkId}`);
    if (meteorKey) {
      return nearAPI.KeyPair.fromString(meteorKey);
    }
  } catch {}

  return null;
}
