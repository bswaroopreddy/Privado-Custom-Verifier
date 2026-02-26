import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [address, setAddress] = useState("");
  const [did, setDid] = useState("");

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const addr = accounts[0];
    setAddress(addr);

    const verifierDid =
      `did:polygonid:polygon:amoy:${addr}`;

    setDid(verifierDid);

    await axios.post("http://localhost:8080/api/set-verifier-did", {
      did: verifierDid
    });

    alert("Verifier DID registered");
  };

  return (
    <div>
      <h2>Verifier Setup</h2>
      <button onClick={connectMetamask}>
        Connect MetaMask
      </button>

      {did && (
        <>
          <p>Address: {address}</p>
          <p>DID: {did}</p>
        </>
      )}
    </div>
  );
}