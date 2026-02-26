const { Resolver } = require('@iden3/js-iden3-auth');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function createVerifierDID() {
  // Generate a random identifier
  const id = crypto.randomBytes(16).toString('hex');

  // Verifier DID format (off-chain verifier)
  const did = `did:iden3:privado:main:${id}`;

  const verifier = {
    did,
    createdAt: new Date().toISOString()
  };

  // Save to file
  const filePath = path.join(__dirname, 'verifier.json');
  fs.writeFileSync(filePath, JSON.stringify(verifier, null, 2));

  console.log("Verifier DID:", did);
}

createVerifierDID();