const path = require('path');


const ADMIN_VENDOR_VIEW_PAGE_SIZE = 10;
const PINCODES_DATA_PATH = path.resolve(__dirname, '../../config/database/statics/pincodes.json');
const STATES_DATA_PATH = path.resolve(__dirname, '../../config/database/statics/states.json')
const PINCODE_REGEX = '^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$';


module.exports = {ADMIN_VENDOR_VIEW_PAGE_SIZE, PINCODES_DATA_PATH, STATES_DATA_PATH, PINCODE_REGEX};