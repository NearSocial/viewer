import { singletonHook } from "react-singleton-hook";
import { useEffect, useState } from "react";
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import ledgerModule from "@web3-onboard/ledger";
import { LsKey } from "./near";
import { ethers } from "ethers";
import ls from "local-storage";

const defaultEthersProvider = undefined;
const web3onboardKey = LsKey + "web3-onboard:connectedWallets";

const wcV1InitOptions = {
  qrcodeModalOptions: {
    mobileLinks: ["metamask", "argent", "trust"],
  },
  connectFirstChainId: true,
};

// const wcV2InitOptions = {
//   version: 2,
//   /**
//    * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
//    */
//   projectId: "abc123...",
// };
const walletConnect = walletConnectModule(wcV1InitOptions);
const ledger = ledgerModule();
const injected = injectedModule();

// initialize Onboard
export const onboard = init({
  wallets: [injected, walletConnect, ledger],
  chains: [
    {
      id: 1,
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://rpc.ankr.com/eth",
    },
    {
      id: 3,
      token: "ETH",
      label: "Ropsten - Ethereum Testnet",
      rpcUrl: "https://rpc.ankr.com/eth_ropsten",
    },
    {
      id: 5,
      token: "ETH",
      label: "Goerli - Ethereum Testnet",
      rpcUrl: "https://rpc.ankr.com/eth_goerli",
    },
    {
      id: "0x4e454152",
      token: "ETH",
      label: "Aurora Mainnet",
      rpcUrl: "https://mainnet.aurora.dev",
    },
    {
      id: 137,
      token: "MATIC",
      label: "Matic Mainnet",
      rpcUrl: "https://rpc.ankr.com/polygon",
    },
    {
      id: 324,
      token: "ETH",
      label: "zkSync",
      rpcUrl: "https://zksync2-mainnet.zksync.io",
    },
    {
      id: 56,
      token: "BNB",
      label: "Binance Smart Chain Mainnet",
      rpcUrl: "https://bsc.publicnode.com",
    },
    {
      id: 42161,
      token: "ETH",
      label: "Arbitrum One Mainnet",
      rpcUrl: "https://endpoints.omniatech.io/v1/arbitrum/one/public",
    },
  ],
  appMetadata: {
    name: "BOS",
    icon: '<svg width="30" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="logotype"><path d="M9.55396 20.518L2 13.009L9.55396 5.5" stroke="#3D7FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.536 5.5L27 13.009L19.536 20.518" stroke="#3D7FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></path></svg>',
    description: "Blockchain Operating System",
  },
  theme: "dark",
  containerElements: {
    // connectModal: '#near-social-navigation-bar',
    // accountCenter: "#near-social-web3-account",
  },
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
