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
  let val = Math.floor(Math.random() * 1000000);
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


// This method returns the filtered object containing only the allowedKeys
const filterObjectByAllowedKeys = (current, allowedKeys) => {
  filtered = {}
  for(const key in current){
    if (allowedKeys.find(allowedKey => (allowedKey == key)) != undefined){
      filtered[key] = current[key];
    }
  }
  return filtered;
}


module.exports = {responseUtil, errorLog, successLog, getOtp, genCode, filterObjectByAllowedKeys}