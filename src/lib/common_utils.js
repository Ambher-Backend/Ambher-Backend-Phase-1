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



module.exports = {responseUtil, errorLog, successLog}