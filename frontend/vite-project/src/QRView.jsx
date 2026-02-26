import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { getAuthRequest } from "./api";

export default function QRView() {
  const [qrData, setQrData] = useState("");

  const generateQR = async () => {
    const request = await getAuthRequest();

    const encoded = btoa(JSON.stringify(request));
    const link = `iden3comm://?i_m=${encoded}`;

    setQrData(link);
  };

  return (
    <div>
      <button onClick={generateQR}>
        Generate Verification QR
      </button>

      {qrData && (
        <>
          <h3>Scan with Privado Wallet</h3>
          <QRCodeCanvas value={qrData} size={300} />

          <p>
            Universal Link:
            <br />
            {qrData}
          </p>
        </>
      )}
    </div>
  );
}