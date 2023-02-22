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
        style={wallet ? { marginRight: "317px" } : {}}
      >
        {connecting ? "Connecting" : wallet ? "Disconnect" : "Connect Wallet"}
      </button>
    </div>
  );
}
