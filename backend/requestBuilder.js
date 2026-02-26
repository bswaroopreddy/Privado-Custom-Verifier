const { auth } = require("@iden3/js-iden3-auth");

function createUniversityRequest(sessionId) {
  const callbackUrl =
    `${process.env.SERVER_URL}/api/callback?sessionId=${sessionId}`;

  const request = auth.createAuthorizationRequest(
    "University Verification",
    process.env.VERIFIER_DID,
    callbackUrl
  );

  // Add proof request
  // request.body.scope = [
  //   {
  //     id: 1,
  //     circuitId: "credentialAtomicQuerySigV2",
  //     query: {
  //       allowedIssuers: [process.env.UNIVERSITY_ISSUER_DID || "*"],
  //       context: process.env.SCHEMA_URL,
  //       type: "UniversityCredential",
  //       credentialSubject: {
  //         year: {}   // existence proof (works for any year)
  //       }
  //     }
  //   }
  // ];


  request.body.scope = [
  {
    "circuitId": "credentialAtomicQuerySigV2",
    "id": 1772157314,
    "query": {
      "allowedIssuers": [
        "*"
      ],
      "context": "ipfs://QmdBpzgvHPcFVF7wSgcoaf5V2pJ9DedPoywJdGfuhS9rNn",
      "credentialSubject": {
        "name": {
        }
      },
      "type": "UniversityCredential"
    }
  }
]
  return request;
}

module.exports = { createUniversityRequest };