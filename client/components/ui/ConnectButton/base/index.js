import React from "react";

// CSS
import styles from "./style.module.css";

// Components
import MetamaskSVG from "components/ui/MetamaskSVG";

const ConnectButton = ({ account, connect, web3 }) => {
  const [inProgress, setInProgress] = React.useState(false);

  // Handle Click
  const handleClick = () => {
    if (!account?.data) {
      setInProgress(true);
      connect()
        .then(() => handleSignup())
        .catch(() => setInProgress(false))
        .finally(() => setInProgress(false));
    }
  };
  return (
    <div className="mx-auto mt-5">
      <span
        className={`bg-zinc-800 inline-flex items-center p-3 montserrat text-white rounded-md text-sm hover:ring-4 ring-zinc-400 transition duration-700 w-64 justify-center ${
          account?.data ? " cursor-default" : "cursor-pointer"
        }`}
        onClick={handleClick}
      >
        {account?.data ? (
          <>
            {String(account.data).slice(0, 10)}...
            {String(account.data).slice(-6)}
          </>
        ) : inProgress ? (
          "In Progress..."
        ) : (
          <>
            <MetamaskSVG />
            Connect with Metamask
          </>
        )}
      </span>
    </div>
  );
};

export default ConnectButton;
