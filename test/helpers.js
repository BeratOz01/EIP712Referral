const signData = async (
  chainId,
  contractAddress,
  referrer,
  referree,
  timestamp,
  signer
) => {
  const domain = {
    name: "Referral",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  const types = {
    Referral: [
      {
        name: "referrer",
        type: "address",
      },
      {
        name: "referree",
        type: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
      },
    ],
  };

  const values = {
    referrer: referrer,
    referree: referree,
    timestamp: timestamp,
  };

  const signature = await signer._signTypedData(domain, types, values);

  return signature;
};

module.exports = signData;
