// Colorful logging
const clc = require("cli-color");

const log = console.log;

function success(message) {
  log(clc.green(message));
}

function error(message) {
  log(clc.red(message));
}

module.exports = {
  success,
  error,
};
