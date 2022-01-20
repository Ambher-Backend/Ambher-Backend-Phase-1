const chalk = require('chalk');

const responseUtil = (status, data, message) => {
  return {
    status: status,
    data: data,
    message: message
  };
};

const errorLog = (message) => {
  console.log(chalk.red(message));
};

const successLog = (message) => {
  console.log(chalk.bgGreen.black(message));
}

const getOtp = () => {
  const val = Math.floor(Math.random() * 1000000);
  if (val.toString().length === 5) {
    val *= 10;
  }
  return val;
}


module.exports = {responseUtil, errorLog, successLog, getOtp}