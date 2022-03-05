const process = require("process");


// Internal Imports
const {logger} = require("../../src/lib/common_utils");


process.on("unhandledRejection", (reason, promise) => {
  logger(`Unhandled Rejection at ${promise} due to ${reason}`);
});


