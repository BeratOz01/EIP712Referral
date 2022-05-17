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
    <div className="mx-auto">
      <span
        className={` bg-indigo-800 inline-flex items-center p-3 montserrat text-white rounded-md text-sm hover:ring-4 ring-indigo-400 transition duration-700 ${
          account?.data ? " cursor-default" : "cursor-pointer"
        }`}
        onClick={handleClick}
      >
        {account ? (
          <>
            {String(account).slice(0, 10)}...
            {String(account).slice(-6)}
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
