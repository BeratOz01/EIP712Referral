// Colorful logging
const clc = require("cli-color");

// nodemailer
const nodemailer = require("nodemailer");

const log = console.log;

function sendEmail(to, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",
      pass: "",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "",
    to,
    subject: "Referral",
    text: message,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) error(err);
    else success(info);
  });
}

function success(message) {
  log(clc.green(message));
}

function error(message) {
  log(clc.red(message));
}

function info(message) {
  log(clc.bgBlue(message));
}

const signData = async (
  chainId,
  contractAddress,
  referrer,
  referree,
  timestamp,
  signer
) => {
  const domain = {
    name: "Referral",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  const types = {
    Referral: [
      {
        name: "referrer",
        type: "address",
      },
      {
        name: "referree",
        type: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
      },
    ],
  };

  const values = {
    referrer: referrer,
    referree: referree,
    timestamp: timestamp,
  };

  const signature = await signer._signTypedData(domain, types, values);

  return signature;
};

module.exports = {
  success,
  error,
  info,
  signData,
  sendEmail,
};
