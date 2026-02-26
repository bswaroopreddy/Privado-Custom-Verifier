const { auth, resolver } = require("@iden3/js-iden3-auth");
const path = require("path");

let verifier;

async function getVerifier() {
  if (verifier) return verifier;

  // const AMOY_STATE_RESOLVER = new resolver.EthStateResolver(
        //     ethURL as string,
        //     contractAddress
        // );

  const resolvers = {
    ["privado:main"]: new resolver.EthStateResolver(
      "https://rpc-mainnet.privado.id",
      "0x3C9acB2205Aa72A05F6D77d708b5Cf85FCa3a896"
    )
  };

  verifier = await auth.Verifier.newVerifier({
    stateResolver: resolvers,
    circuitsDir: path.join(__dirname, "keys"),
    ipfsGatewayURL: "https://ipfs.io"
  });

  return verifier;
}

module.exports = { getVerifier };