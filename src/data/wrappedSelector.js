import { NetworkId } from "./widgets";

const MainnetSocialDbContractName = "social.near";

export async function wrapWalletSelector(selector) {
  selector = await selector;
  return {
    ...selector,
    wallet: async () => {
      const wallet = await selector.wallet();
      return {
        ...wallet,
        signAndSendTransaction: async ({ receiverId, actions }) => {
          // TODO: isPremium
          const accountId =
            selector.store.getState()?.accounts?.[0]?.accountId ?? null;
          const isPremium = true;
          if (
            NetworkId === "mainnet" &&
            isPremium &&
            receiverId === MainnetSocialDbContractName &&
            actions.length === 1 &&
            actions[0].type === "FunctionCall" &&
            actions[0].params.methodName === "set" &&
            actions[0].params.deposit === "0"
          ) {
            const [_bytes, signedTransaction] = await wallet.signTransaction({
              receiverId,
              actions,
            });
            console.log("SENDING SIGNED TRANSACTION", signedTransaction);
            // return wallet.sendTransaction(signedTransaction);
          }
          // return wallet.signAndSendTransaction(receiverId, actions);
        },
      };
    },
  };
}
