// Provider
const { provider } = require("../utils/account");

// ethers.js
const { ethers } = require("ethers");

// ABI & Contract Address
const { CONTRACT_ADDRESS } = require("../config/index");
const ABI = require("./ABI/EIP712Referral.json");

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider);

module.exports = { contract };
