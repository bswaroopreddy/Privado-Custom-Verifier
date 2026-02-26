const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const getRawBody = require("raw-body");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { auth, resolver } = require("@iden3/js-iden3-auth");
const path = require("path");

const { createUniversityRequest } = require("./requestBuilder");
const { getVerifier } = require("./verifier");

// const { createVerifierDID } = require("./createVerifierDID");

// async function init() {
//   if (!process.env.VERIFIER_DID) {
//     const did = await createVerifierDID();
//     process.env.VERIFIER_DID = did;
//   }

//   console.log("Verifier DID:", process.env.VERIFIER_DID);
// }

// init();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const requestMap = new Map();
const verificationMap = new Map();
const shortUrlMap = new Map();

/* -----------------------------------
   NGROK FIX
----------------------------------- */
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

/* -----------------------------------
   VERIFY ENV
----------------------------------- */
// if (!process.env.VERIFIER_DID) {
//   throw new Error("VERIFIER_DID missing in .env");
// }

// console.log("Verifier DID set:", process.env.VERIFIER_DID);

/* -----------------------------------
   1. AUTH REQUEST
----------------------------------- */
app.get("/api/sign-in", async (req, res) => {
  try {
    const sessionId = uuidv4();
    const verificationId = uuidv4();

    const request = createUniversityRequest(sessionId);

    request.id = uuidv4();
    request.thid = uuidv4();

    requestMap.set(sessionId, { ...request, verificationId: verificationId }); 
     
    verificationMap.set(verificationId, {
      status: "pending"
    });

    const shortId = crypto.randomBytes(6).toString("hex");
    shortUrlMap.set(shortId, request);

    const requestUri =
      `${process.env.SERVER_URL}/requestjson/${shortId}`;

    res.json({
      sessionId,
      verificationId,
      request,
      shortenURL:
        `iden3comm://?request_uri=${encodeURIComponent(requestUri)}`,
      encodedURI:
        `iden3comm://?i_m=${Buffer.from(JSON.stringify(request)).toString("base64")}`,
      requestUri,
      statusUrl:
        `${process.env.SERVER_URL}/api/verificationstatus/${verificationId}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* -----------------------------------
   2. request_uri endpoint
----------------------------------- */
app.get("/requestjson/:id", (req, res) => {
  const request = shortUrlMap.get(req.params.id);
  if (!request) return res.status(404).send("Not found");
  res.json(request);
});

/* -----------------------------------
   3. CALLBACK
----------------------------------- */
app.post("/api/callback", async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    const stored = requestMap.get(sessionId);
    if (!stored) return res.status(400).send("Session not found");
    const authRequest = requestMap.get(`${sessionId}`);
    console.log(authRequest);
    console.log("\n");
    console.log(sessionId);
    const raw = await getRawBody(req);

    const tokenStr = raw.toString();
    console.log(tokenStr);

    const verificationId = stored.verificationId;

    verificationMap.set(verificationId, {
      status: "inprogress"
    });
    // const ethURL = "https://rpc-mainnet.privado.id";
     const ethURL = "https://rpc-amoy.polygon.technology";
     const contractAddress = "0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124";
        // const contractAddress = '0x3C9acB2205Aa72A05F6D77d708b5Cf85FCa3a896'
     const keyDIR = "./keys";

      const AMOY_STATE_RESOLVER = new resolver.EthStateResolver(
            ethURL,
            contractAddress
      );

      const resolvers = {
           ["polygon:amoy"]: AMOY_STATE_RESOLVER,
        //     ["privado:main"]: new resolver.EthStateResolver(
        //         "https://rpc-mainnet.privado.id",
        //         "0x975556428F077dB5877Ea2474D783D6C69233742",
        //     ),
        //     ["privado:test"]: new resolver.EthStateResolver(
        //         "https://rpc-testnet.privado.id/",
        //         "0x975556428F077dB5877Ea2474D783D6C69233742",
        //     ),
         };

        const verifier = await auth.Verifier.newVerifier({
            stateResolver: resolvers,
            circuitsDir: path.join(__dirname, keyDIR),
            ipfsGatewayURL: "https://ipfs.io",
        });

            const opts = {
                acceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
            };
            const authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);

            verificationMap.set(verificationId, {
                status: 'completed',
                token: tokenStr,
                result: authResponse
            });

            return res
                .status(200)
                .set("Content-Type", "application/json")
                .send({});

    // const verifier = await getVerifier();

    // const result = await verifier.fullVerify(
    //   tokenStr,
    //   stored.request,
    //   { acceptedStateTransitionDelay: 5 * 60 * 1000 }
    // );

    // verificationMap.set(verificationId, {
    //   status: "completed",
    //   result
    // });

    // console.log("Verification SUCCESS");

    // res.json({ success: true });

  } catch (err) {
    console.error("Verification FAILED:", err.message);

    const verificationId =
      requestMap.get(req.query.sessionId)?.verificationId;

    if (verificationId) {
      verificationMap.set(verificationId, {
        status: "failed",
        error: err.message
      });
    }

    res.status(400).send("Verification failed");
  }
});

/* -----------------------------------
   4. STATUS
----------------------------------- */
app.get("/api/verificationstatus/:id", (req, res) => {
  const data = verificationMap.get(req.params.id);
  if (!data) return res.status(404).send("Not found");
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});