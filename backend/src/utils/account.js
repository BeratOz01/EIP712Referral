const { PRIVATE_KEY } = require("../config/index");

const ethers = require("ethers");

const { error } = require("../helpers/index");

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

provider.on("error", (e) => error("Error on connecting on Ethereum node", e));

const account = new ethers.Wallet(PRIVATE_KEY, provider);

module.exports = { account, provider };
