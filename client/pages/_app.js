import "../styles/globals.css";

// Web3 Provider
import { Web3Provider } from "../components/providers";

// react-toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
