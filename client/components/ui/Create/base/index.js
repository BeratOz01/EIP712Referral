import React from "react";

const Create = ({ web3, contract, account }) => {
  return (
    <div className="flex flex-col">
      <p className="text-center font-bold text-black montserrat text-4xl">
        Create Referral
      </p>
      <h1 className="text-center montserrat w-6/12 mx-auto tracking-wide mt-10">
        In real life applications, users who have logged in before can create
        referrals. But for this specific project we will just create a referral
        for the account that is logged in for this demo.
      </h1>
    </div>
  );
};

export default Create;
