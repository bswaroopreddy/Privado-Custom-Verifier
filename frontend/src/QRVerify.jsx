import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const BASE_URL = "http://localhost:8080";

export default function QRVerify() {
  const [qrData, setQrData] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!verificationId) return;

    const interval = setInterval(async () => {
      const res = await axios.get(
        `${BASE_URL}/api/verificationstatus/${verificationId}`
      );

      setStatus(res.data.status);

      if (
        res.data.status === "completed" ||
        res.data.status === "failed"
      ) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [verificationId]);

  const generateQR = async () => {
    setStatus("pending");

    const res = await axios.get(`${BASE_URL}/api/sign-in`);

    const link =
      res.data.shortenURL ||
      res.data.encodedURI ||
      `iden3comm://?request_uri=${encodeURIComponent(res.data.requestUri)}`;

    setQrData(link);
    setVerificationId(res.data.verificationId);
  };

  const statusText = {
    idle: "Click below to begin verification",
    pending: "Waiting for wallet scan...",
    inprogress: "Verifying credential...",
    completed: "Verification Successful ✓",
    failed: "Verification Failed ✗"
  };

  return (
    <div className="card">
  <h2 className="card-title">
    Verify Your Credential
  </h2>

  <p className="card-subtitle">
    Scan this QR using your Privado ID Wallet
  </p>

  {!qrData && (
    <button className="primary-btn" onClick={generateQR}>
      Generate QR Code
    </button>
  )}

  {qrData && (
    <>
      <div className="qr-wrapper">
        <QRCodeCanvas value={qrData} size={240} />
      </div>

      <p className={`status ${status}`}>
        {statusText[status]}
      </p>
    </>
  )}
</div>
  );
}