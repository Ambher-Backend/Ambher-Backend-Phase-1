const path = require("path");


const ADMIN_VENDOR_VIEW_PAGE_SIZE = 10;
const PINCODES_DATA_PATH = path.resolve(__dirname, "../../config/database/statics/pincodes.json");
const STATES_DATA_PATH = path.resolve(__dirname, "../../config/database/statics/states.json");
const PINCODE_REGEX = "^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$";
const RESPONSE_CODES = {
  BAD_REQUEST_CODE: 400,
  INTERNAL_SERVER_ERROR_CODE: 500,
  UNAUTHORISED_ERROR_CODE: 401,
  SUCCESS_CODE: 200,
  CREATED_CODE: 201,
  ACCESS_ERROR_CODE: 405,
  UNPROCESSABLE_ERROR_CODE: 422,
  NOT_FOUND_ERROR_CODE: 404
};


module.exports = {ADMIN_VENDOR_VIEW_PAGE_SIZE, PINCODES_DATA_PATH, STATES_DATA_PATH, PINCODE_REGEX, RESPONSE_CODES};
