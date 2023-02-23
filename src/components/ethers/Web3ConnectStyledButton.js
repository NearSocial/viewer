import React from "react";
import { useConnectWallet } from "@web3-onboard/react";

export default function Web3ConnectStyledButton(props) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return (
    <div>
      <button
        className={`btn ${props.className} ${
          connecting || wallet ? "btn-outline-dark" : "btn-outline-primary"
        }`}
        disabled={connecting}
        onClick={() => (wallet ? disconnect(wallet) : connect())}
      >
        {connecting ? props.connectingLabel ?? "Connecting" : wallet ? props.disconnectLabel ?? "Disconnect" : props.connectLabel ?? "Connect Wallet"}
      </button>
    </div>
  );
}
