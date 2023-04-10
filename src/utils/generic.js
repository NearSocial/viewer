/* Connecting to the testnet. */
/* Connecting to the testnet. */
// import * as nearAPI from "near-api-js";
// const connectionConfig = {
//     networkId: "testnet",
//     keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(), // first create a key store 
//     nodeUrl: "https://rpc.testnet.near.org",
//     walletUrl: "https://wallet.testnet.near.org",
//     helperUrl: "https://helper.testnet.near.org",
//     explorerUrl: "https://explorer.testnet.near.org",
// };
// const nearConnection = await nearAPI.connect(connectionConfig);


export const getEmailId = (email) => {
    return email.split('@')[0];
}

export const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}


export const createNEARAccount = async (accountId, publicKey) => {
    // TODO: replace creator account ID
    // const account = await nearConnection.account('creatorAccountId');
    // return await account.createAccount(
    //     accountId,
    //     publicKey,
    //     "10000000000000000000" // initial balance for new account in yoctoNEAR
    // );
}

export const getNEARAccount = async (accountId) => {
    // const account = await nearConnection.account(accountId);
    // return await account.getAccountDetails();
}

export const parseURLParams = (url) => {
    const params = new URLSearchParams(url);
    const data = {};
    for (const [key, value] of params) {
        data[key] = value;
    }
    return data;
}