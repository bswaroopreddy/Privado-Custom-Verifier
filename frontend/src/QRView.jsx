import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function QRView() {
  const [qrData, setQrData] = useState("");
  const [statusUrl, setStatusUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    try {
      setLoading(true);
      setQrData("");

      const res = await axios.get("http://localhost:8080/api/sign-in");

      console.log("Backend response:", res.data);

      let link = "";

      // Prefer request_uri format (recommended)
      if (res.data.shortenURL) {
        link = res.data.shortenURL;
      }
      // Fallback if backend returns encodedURI
      else if (res.data.encodedURI) {
        link = res.data.encodedURI;
      }
      // Fallback if only requestUri is returned
      else if (res.data.requestUri) {
        link = `iden3comm://?request_uri=${encodeURIComponent(res.data.requestUri)}`;
      } else {
        alert("Backend did not return a valid link");
        return;
      }

      setQrData(link);
      setStatusUrl(res.data.statusUrl || "");

    } catch (err) {
      console.error("API error:", err);
      alert("Backend not reachable or ngrok not running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>University Verifier</h2>

      <button onClick={generateQR} disabled={loading}>
        {loading ? "Generating..." : "Generate QR"}
      </button>

      {qrData && (
        <div style={{ marginTop: 20 }}>
          <p style={{ wordBreak: "break-all" }}>{qrData}</p>

          <QRCodeCanvas value={qrData} size={280} />

          {statusUrl && (
            <div style={{ marginTop: 10 }}>
              <strong>Status URL:</strong>
              <p style={{ wordBreak: "break-all" }}>{statusUrl}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



// import { useState } from "react";
// import axios from "axios";
// import { QRCodeCanvas } from "qrcode.react";

// export default function QRView() {
//   const [qr, setQr] = useState("");
//   const [statusUrl, setStatusUrl] = useState("");

//   const generateQR = async () => {
//     const res = await axios.get("http://localhost:8080/api/sign-in");

//     setQr(res.data.shortenURL);
//     setStatusUrl(res.data.statusUrl);
//   };

//   const checkStatus = async () => {
//     const res = await axios.get(statusUrl);
//     alert(JSON.stringify(res.data, null, 2));
//   };

//   return (
//     <div>
//       <button onClick={generateQR}>Generate QR</button>

//       {qr && (
//         <>
//           <QRCodeCanvas value={qr} size={260} />
//           <br />
//           <button onClick={checkStatus}>Check Status</button>
//         </>
//       )}
//     </div>
//   );
// }