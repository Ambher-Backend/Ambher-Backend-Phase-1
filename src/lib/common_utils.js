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

const genCode = (n = 10) => {
  n = n || 16;
  let result = '';
  while (n--){
    result += Math.floor(Math.random()*16).toString(16).toUpperCase();
  }
  return result;
}


module.exports = {responseUtil, errorLog, successLog, getOtp, genCode}