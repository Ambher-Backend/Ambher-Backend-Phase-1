const fs = require('fs')


//internal imports
const constants = require('../lib/constants');
const commonUtils = require('../lib/common_utils');


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'cityAndState': ['districtName', 'stateName']
};



const getCityandState = (reqParams) => {
  const pincodes = fs.readFileSync(constants.PINCODES_DATA_PATH);
  let responseData = pincodes[reqParams.pincode];
  return commonUtils.filterObjectByAllowedKeys(responseData, eventKeyExposeObject['cityAndState']);
}


const getStates = () => {
  const states = fs.readFileSync(constants.STATES_DATA_PATH);
  return states;
}


module.exports = {getCityandState, getStates};