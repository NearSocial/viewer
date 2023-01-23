import React from "react";
import { useConnectWallet } from "@web3-onboard/react";

export default function Web3ConnectButton() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return (
    <div>
      <button
        className={`btn me-3 ${
          connecting || wallet ? "btn-outline-light" : "btn-primary"
        }`}
        disabled={connecting}
        onClick={() => (wallet ? disconnect(wallet) : connect())}
      >
        Web3 {connecting ? "connecting" : wallet ? "disconnect" : "Connect"}
      </button>
    </div>
  );
}
