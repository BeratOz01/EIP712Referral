import React from "react";

// Axios Client
import { axiosClient } from "utils/axiosClient";

// Components
import { Spinner } from "components/ui/Spinner";
import { Modal } from "components/ui/Modal";

// Helper
import { createSignedData } from "utils/createSignedData";

// Toast
import { toast } from "react-toastify";

const Create = ({ web3, contract, account }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(true);
  const [success, setSuccess] = React.useState(null);
  const [transactionLoading, setTransactionLoading] = React.useState(false);

  const [referree, setReferree] = React.useState("");
  const [isValidAddress, setIsValidAddress] = React.useState(null);
  const [isValid, setIsValid] = React.useState();

  const checkAddress = () => {
    let isV = web3.utils.isAddress(referree);
    setIsValidAddress(isV);
  };

  const onChange = (e) => {
    setReferree(e.target.value);
  };

  const onSubmit = async () => {
    if (isValidAddress == false || referree == "" || referree == account) {
      toast.error("Please fill the from correctly", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    let nowInUnix = Math.round(new Date().getTime() / 1000);

    let chainId = await web3.eth.net.getId();
    let address = contract._address;

    let signature = await createSignedData(
      chainId,
      address,
      account,
      referree,
      nowInUnix,
      web3,
      account
    );

    await axiosClient
      .post(
        "/referral/create",
        {
          to: referree,
          signature: signature.result,
          timestamp: (nowInUnix + 600).toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((res) => {
        toast.success("Invitation sended!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while sending invitation!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let jwt = localStorage.getItem("access_token");

      const isV = await contract.methods.isValidReferrer(account).call();
      setIsValid(isV);

      if (!jwt) {
        setLoading(false);
        setData([]);
        return;
      }

      let refs = await axiosClient.get(`/referral/${account}`, {
        headers: {
          Authorization: `${jwt}`,
        },
      });

      setLoading(false);
      setData(refs.data.referral);
    };

    if (account && contract) fetchData();
  }, [account, contract]);

  const onAccept = async (ref) => {
    setTransactionLoading(true);
    setShow(true);
    let referral = {
      referrer: ref.from,
      referree: account,
      timestamp: ref.timestamp,
    };

    await contract.methods
      .submitReferral(referral, ref.signature)
      .send({ from: account })
      .then(() => {
        setError(false);
        setSuccess(true);
      })
      .catch((e) => {
        setTransactionLoading(false);
        setError(true);
      });
  };

  return (
    <div className="flex flex-col">
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          setTimeout(() => {
            setTransactionLoading(false);
            setSuccess(false);
            setError(false);
          }, 1000);
        }}
        success={success}
        error={error}
        loading={transactionLoading}
      />
      {loading ? (
        <div className="text-center my-10">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          {isValid ? (
            <React.Fragment>
              <p className="text-center font-bold text-black montserrat text-4xl">
                Create Referral
              </p>
              <h1 className="text-center montserrat w-6/12 mx-auto tracking-wide mt-4">
                You are already registered as a Referrer. You can create
                referrals for other users. So other users can use your referral
                for get in. You can create referral as many as you want but only
                5 of them can be submitted to the smart contract.
              </h1>
              <div className="w-6/12 mx-auto mt-10 flex px-5 ">
                <div className="w-full">
                  <p className="text-black tracking-wider font-bold text-xl h-10 mb-0 montserrat">
                    Referrer
                  </p>
                  <input
                    disabled
                    defaultValue={account}
                    className="w-full flex mt-0 rounded-sm border-2 border-gray-200 h-10 px-5 focus:outline-none montserrat"
                  />
                  <p className="text-black tracking-wider font-bold text-xl h-10 mb-0 montserrat mt-5">
                    Referree
                  </p>
                  <input
                    className={`w-full flex mt-0 rounded-sm border-2 h-10 px-5 focus:outline-none montserrat  ${
                      isValidAddress == true
                        ? "border-green-500 border-2"
                        : isValidAddress == false
                        ? "border-red-500 border-2"
                        : ""
                    }`}
                    onChange={onChange}
                    onBlur={() => {
                      if (referree == "") setIsValidAddress(null);
                      else checkAddress();
                    }}
                  />
                  <div
                    className="w-4/12 bg-indigo-700 rounded-md flex mx-auto mt-6 cursor-pointer"
                    onClick={onSubmit}
                  >
                    <p className="montserrat mx-auto font-bold text-white py-2 px-1">
                      Submit
                    </p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="text-center font-bold text-black montserrat text-4xl">
                Submit Referral
              </p>
              <h1 className="text-center montserrat w-6/12 mx-auto tracking-wide mt-10">
                In real life applications, users who have logged in before can
                create referrals. But for this specific project we will just
                create a referral for the account that is logged in for this
                demo.
              </h1>

              {data && data.length !== 0 ? (
                <>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-8/12 mx-auto mt-5">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 montserrat uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            From
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Signature
                          </th>
                          <th scope="col" className="px-6 py-3">
                            <span className="sr-only"></span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length}
                        {data.map((item, index) => (
                          <tr
                            className="text-xs text-gray-700 dark:text-gray-400"
                            key={index}
                          >
                            <td className="px-6 py-4 whitespace-no-wrap">
                              {item.from.slice(0, 15)}...
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              {item.timestamp}
                            </td>

                            <td className="px-6 py-4 whitespace-no-wrap">
                              {item.signature.slice(0, 20)}...
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div
                                className="bg-indigo-700 flex text-white text-md cursor-pointer montserrat py-1 px-2 rounded-md font-bold"
                                onClick={() => onAccept(item)}
                              >
                                <p className="mx-auto">Accept</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Create;
