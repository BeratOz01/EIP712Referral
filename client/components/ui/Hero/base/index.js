import { useWeb3 } from "components/providers";

const Hero = () => {
  const { contract } = useWeb3();
  return (
    <div className="container mx-auto flex flex-col items-center py-12 sm:py-24 montserrat font-bold">
      <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col  mb-5 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center leading-7 md:leading-10">
          Referral System Based On{" "}
          <span className="text-indigo-700">Blockchain</span>
        </h1>
        <p className="mt-5 sm:mt-10 lg:w-10/12 font-normal text-center text-sm sm:text-lg">
          This is a decentralized application that allows you to earn rewards
          for your referrals. You can create referrals for your friends and earn
          rewards for each referral. But in this case, we are using EIP-712
          implementation for the system so creators do not need to send
          transactions for each referral. Only one transaction is enough for
          submitting referral.
        </p>
      </div>
      <div className="flex justify-center items-center tracking-wider">
        <button
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 lg:text-xl lg:font-bold  rounded text-white px-4 sm:px-10 border border-indigo-700 py-2 sm:py-4 text-sm"
          onClick={() =>
            window.open(
              `https://snowtrace.io/address/${contract._address}`,
              "_blank"
            )
          }
        >
          See Contract On Snowtrace
        </button>
        <button
          className="ml-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-transparent transition duration-150 ease-in-out hover:border-indigo-600 lg:text-xl lg:font-bold  hover:text-indigo-600 rounded border border-indigo-700 text-indigo-700 px-4 sm:px-10 py-2 sm:py-4 text-sm"
          onClick={() => {
            window.open(
              "https://github.com/BeratOz01/EIP712Referral",
              "_blank"
            );
          }}
        >
          GitHub
        </button>
      </div>
    </div>
  );
};

export default Hero;
