import { useState } from "react";

export default function Admin() {
  const [address, setAddress] = useState("");

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    setAddress(accounts[0]);
  };

  return (
    <>
      {!address ? (
        <button
          className="wallet-btn"
          onClick={connectMetamask}   // ✅ FIX
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="wallet-connected">
          Connected: {address.slice(0,6)}...{address.slice(-4)}
        </div>
      )}
    </>
  );
}