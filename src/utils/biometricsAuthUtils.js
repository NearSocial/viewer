import * as nearAPI from "near-api-js";
// import { connect, keyStores, WalletConnection, Near } from "near-api-js";
import { base_encode } from "near-api-js/lib/utils/serialize";
import { KeyPair } from "near-api-js/lib/utils/key_pair";

export const MASTER_USER_ID = "gutsyphilip.testnet";
const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:');
const keyPair = KeyPair.fromString('ed25519:4HnQUNMTgi6ht9oCemkLPqYf259fc1P91dJghqb3qhsgFa4krV46SMCxrYv5c1ArDhMDNsL6NV7tfreEHi5j7aSF');
await keyStore.setKey('testnet', MASTER_USER_ID, keyPair);

const config = {
    networkId: "testnet",
    keyStore: keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    masterAccount: MASTER_USER_ID
};


const nearConnection = await nearAPI.connect(config);
const wallet = new nearAPI.WalletConnection(nearConnection);
const account = await nearConnection.account(MASTER_USER_ID);
const near = new nearAPI.Near(config);

export const createAccount = async (username, publicKeyObjectED) => {
    console.log('username', username);
    console.log('publicKeyObjectED', publicKeyObjectED);
    console.log('publicKey', publicKeyObjectED.getPublicKey());
    // return await near.createAccount(username, publicKeyObjectED);
    return await account.createAccount(username, publicKeyObjectED.getPublicKey().toString(), "1000000000000000000000000");
};

export const getCorrectAccessKey = async (userName, firstKeyPair, secondKeyPair) => {
    console.log('userName', userName);
    // console.log('base64.toString(userHandle)', base64.toString(userName));
    const account = await nearConnection.account(userName);
    console.log('account', account);
    const accessKeys = await account.getAccessKeys();
    console.log('accessKeys', accessKeys);

    const firstPublicKeyB58 = "ed25519:" + base_encode((firstKeyPair.getPublicKey().data))
    const secondPublicKeyB58 = "ed25519:" + base_encode((secondKeyPair.getPublicKey().data))

    const accessKey = accessKeys.find((accessKey) => accessKey.public_key === firstPublicKeyB58 || secondPublicKeyB58);
    if (!accessKey) {
        throw new Error('No access key found');
    } else if (accessKey.public_key === firstPublicKeyB58) {
        return firstKeyPair;
    } else {
        return secondKeyPair;
    }
};