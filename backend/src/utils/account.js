const { PRIVATE_KEY } = require("../config/index");

const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const account = new ethers.Wallet(PRIVATE_KEY, provider);

module.exports = { account };
