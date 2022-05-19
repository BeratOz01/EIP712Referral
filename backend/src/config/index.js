// .env configuration
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

module.exports = { MONGODB_URL, JWT_SECRET, PRIVATE_KEY, CONTRACT_ADDRESS };
