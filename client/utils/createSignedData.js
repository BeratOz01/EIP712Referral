const createSignedData = (
  chainId,
  address,
  referrer,
  referree,
  timestamp,
  web3,
  signer
) => {
  const domain = {
    name: "Referral",
    version: "1",
    chainId,
    verifyingContract: address,
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

  const data = JSON.stringify({
    domain,
    types,
    message: values,
    primaryType: "Referral",
  });

  var params = [signer, data];

  const sig = web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params: params,
      from: signer,
    },
    (err, result) => {
      if (err) console.error(err);
      else {
        return result;
      }
    }
  );

  console.log(result.result);
  return sig;
};

module.exports = { createSignedData };
