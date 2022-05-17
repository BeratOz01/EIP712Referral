import React from "react";

// Components
import { ConnectButton, Hero, Create } from "../components/ui";

// Hooks
import { useAccount } from "../components/hooks";
import { useWeb3 } from "../components/providers";

// Axios Client
import { axiosClient } from "utils/axiosClient";

export default function Home() {
  // Hooks Initialization
  const { account } = useAccount();
  const { connect, web3, contract } = useWeb3();

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const handleSignMessage = async (publicAddress, nonce) => {
      const c = await web3.eth.getCoinbase();

      let sig = await web3.eth.personal.sign(
        web3.utils.fromUtf8(`One time nonce for Referral System: ${nonce}`),
        c,
        "",
        (err, signature) => {
          if (err) {
            console.log(err);
            return;
          }
          return signature;
        }
      );

      await axiosClient
        .post(`/user/${publicAddress}/signature`, {
          signature: sig,
        })
        .then((response) => {
          localStorage.setItem("access_token", response.data.token);
        })
        .catch((err) => {
          console.error(err);
          alert(err.response.data.message);
        });
    };

    const handleSignUp = async (address) => {
      console.log("handleSignUp");
      axiosClient
        .post("/user", {
          publicAddress: address,
        })
        .then(async (resp) => {
          console.log(resp.data.user.nonce);
          console.log(resp.data.user.publicAddress);

          let nonce = resp.data.user.nonce;
          let publicAddress = resp.data.user.publicAddress;

          await handleSignMessage(publicAddress, nonce);
        });
    };

    const handleLogIn = async () => {
      const c = await web3.eth.getCoinbase();

      await axiosClient
        .get(`/user/${c}`)
        .then((resp) => {
          let publicAddress = resp.data.user.publicAddress;
          let nonce = resp.data.user.nonce;

          let jwt = localStorage.getItem("access_token");

          if (!jwt) handleSignMessage(publicAddress, nonce);
        })
        .catch((err) => {
          let errorMessage = err.response.data.message;
          if (errorMessage === "User not found") handleSignUp(c);
        });
    };

    if (account?.data && web3) {
      handleLogIn();
    }
  }, [account?.data, web3]);

  return (
    <div className=" pb-12 overflow-y-hidden" style={{ minHeight: 700 }}>
      {/* Code block starts */}
      <nav className="w-full border-b shadow-2xl shadow-indigo-100">
        <div className="py-5 md:py-0 container mx-auto px-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => setShow(!show)}
              className={`${
                show ? "hidden" : ""
              } sm:block md:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500`}
            >
              <svg
                aria-label="Open Main Menu"
                xmlns="http://www.w3.org/2000/svg"
                className="md:hidden icon icon-tabler icon-tabler-menu"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1={4} y1={8} x2={20} y2={8} />
                <line x1={4} y1={16} x2={20} y2={16} />
              </svg>
            </button>
            <div
              id="menu"
              className={` ${show ? "" : "hidden"} md:block lg:block `}
            >
              <button
                onClick={() => setShow(!show)}
                className={`block md:hidden lg:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 fixed focus:outline-none focus:ring-2 focus:ring-gray-500 z-30 top-0 mt-6`}
              >
                <svg
                  aria-label="close main menu"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
              <ul className="flex text-3xl montserrat tracking-wider md:text-base items-center py-5 md:flex flex-col md:flex-row justify-center fixed md:relative top-0 bottom-0 left-0 right-0 bg-white md:bg-transparent z-20 space-x-10">
                <li className="text-gray-700 cursor-pointer text-base lg:text-lg pt-10 md:pt-0 hover:text-indigo-700 transition duration-200">
                  <a href="javascript: void(0)">Home</a>
                </li>
                <li className="text-gray-700 cursor-pointer text-base lg:text-lg pt-10 md:pt-0 hover:text-indigo-700 transition duration-200">
                  <a href="javascript: void(0)">Create Referral</a>
                </li>
              </ul>
            </div>
          </div>
          <button className="hidden md:block">
            <ConnectButton
              account={account?.data}
              connect={connect}
              web3={web3}
            />
          </button>
        </div>
      </nav>
      <div>
        <Hero />
      </div>
      <div>
        <Create account={account?.data} web3={web3} contract={contract} />
      </div>
    </div>
  );
}
