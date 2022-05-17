import React from "react";

// SWR
import useSWR from "swr";

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retrieve an account. Please refresh the browser."
        );
      }

      return account.toLowerCase();
    }
  );

  React.useEffect(() => {
    const mutator = (accounts) => {
      localStorage.removeItem("access_token");
      mutate(accounts[0] ?? null);
    };
    provider?.on("accountsChanged", mutator);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [provider, mutate]);

  return {
    account: {
      data,
      mutate,
      ...rest,
    },
  };
};
