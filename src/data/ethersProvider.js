import { singletonHook } from "react-singleton-hook";
import { useEffect, useState } from "react";
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { LsKey } from "./near";
import { ethers } from "ethers";
import ls from "local-storage";

const defaultEthersProvider = undefined;
const web3onboardKey = LsKey + "web3-onboard:connectedWallets";

const injected = injectedModule();

const rpcUrl = "https://mainnet.aurora.dev";

// initialize Onboard
export const onboard = init({
  wallets: [injected],
  chains: [
    {
      id: "0x4e454152",
      token: "ETH",
      label: "Aurora Mainnet",
      rpcUrl,
    },
  ],
});

export const useEthersProvider = singletonHook(defaultEthersProvider, () => {
  const [{ wallet }] = useConnectWallet();
  const [ethersProvider, setEthersProvider] = useState(null);

  useEffect(() => {
    (async () => {
      const walletsSub = onboard.state.select("wallets");
      const { unsubscribe } = walletsSub.subscribe((wallets) => {
        const connectedWallets = wallets.map(({ label }) => label);
        ls.set(web3onboardKey, connectedWallets);
      });

      const previouslyConnectedWallets = ls.get(web3onboardKey) || [];

      if (previouslyConnectedWallets) {
        // You can also auto connect "silently" and disable all onboard modals to avoid them flashing on page load
        await onboard.connectWallet({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true,
          },
        });
      }
    })();
  }, []);

  useEffect(() => {
    setEthersProvider(
      wallet ? new ethers.providers.Web3Provider(wallet.provider) : null
    );
  }, [wallet]);

  return ethersProvider;
});
