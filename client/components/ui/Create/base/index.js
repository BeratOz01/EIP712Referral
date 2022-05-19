import React from "react";

// Axios Client
import { axiosClient } from "utils/axiosClient";

// Components
import { Spinner } from "components/ui/Spinner";
import { Modal } from "components/ui/Modal";

const Create = ({ web3, contract, account }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(true);
  const [success, setSuccess] = React.useState(null);
  const [transactionLoading, setTransactionLoading] = React.useState(false);

  const [isValid, setIsValid] = React.useState();

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
            <div className="text-center my-10">
              <h1 className="text-2xl font-bold montserrat">
                You are already registered as a Referrer
              </h1>
            </div>
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
                <div className="flex mx-auto w-8/12 mt-10 overflow-hidden">
                  <div className="w-full bg-indigo-700 rounded-md  shadow-sm">
                    <p className="montserrat text-xl tracking-wider text-center text-white py-4">
                      You are have not any invitation
                    </p>
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {/* <p className="text-center font-bold text-black montserrat text-4xl">
        Submit Referral
      </p>
      <h1 className="text-center montserrat w-6/12 mx-auto tracking-wide mt-10">
        In real life applications, users who have logged in before can create
        referrals. But for this specific project we will just create a referral
        for the account that is logged in for this demo.
      </h1> */}
    </div>
  );
};

export default Create;

/**
       * <tr className="bg-white border-b  hover:bg-gray-50">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                          >
                            Apple MacBook Pro 17"
                          </th>
                          <td className="px-6 py-4">Sliver</td>
                          <td className="px-6 py-4">Laptop</td>
                          <td className="px-6 py-4">$2999</td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href="#"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Accept
                            </a>
                          </td>
                        </tr>
       */
