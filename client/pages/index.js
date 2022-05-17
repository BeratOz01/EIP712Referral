import React from "react";

// Components
import { ConnectButton } from "../components/ui";

// Hooks
import { useAccount } from "../components/hooks";
import { useWeb3 } from "../components/providers";

// Axios Client
import { axiosClient } from "utils/axiosClient";

export default function Home() {
  // Hooks Initialization
  const { account } = useAccount();
  const { connect, web3 } = useWeb3();

  React.useEffect(() => {
    const handleSignMessage = async ({ publicAddress, nonce }) => {
      let sig = await web3.eth.personal.sign(
        web3.utils.fromUtf8(`One time nonce for Referral System: ${nonce}`),
        publicAddress,
        "",
        (err, signature) => {
          if (err) {
            console.log(err);
            return;
          }
          return signature;
        }
      );

      console.log(sig);
      axiosClient
        .post(`/user/${publicAddress}/signature`, {
          signature: sig,
        })
        .then((response) => {
          localStorage.setItem("access_token", response.data.token);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const handleSignUp = async (address) => {
      await axiosClient
        .post("/user", {
          publicAddress: address,
        })
        .then(handleSignMessage);
    };

    const handleLogIn = async () => {
      const c = await web3.eth.getCoinbase();

      await axiosClient
        .get(`/user/${c}`)
        .catch((err) => {
          let errorMessage = err.response.data.message;
          if (errorMessage === "User not found") {
            handleSignUp(c);
          }
        })
        .then((resp) => {
          console.log(resp.data.user);
          let publicAddress = resp.data.user.publicAddress;
          let nonce = resp.data.user.nonce;

          let jwt = localStorage.getItem("access_token");
          console.log(jwt);

          if (!jwt) {
            handleSignMessage({ publicAddress, nonce });
          }
        });
    };

    if (account?.data && web3) handleLogIn();
  }, [account?.data, web3]);

  return (
    <div className="container mx-auto flex">
      <ConnectButton account={account} connect={connect} web3={web3} />
    </div>
  );
}
