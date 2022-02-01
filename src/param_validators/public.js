const config = require('config');


// Internal Imports
const paramValidator = require('../lib/param_validator').ParamValidator;
const commonValidators = require('../lib/param_validator');
const commonUtils = require('../lib/common_utils');
const constants = require('../lib/constants');


//GET
const getCityStateValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.params);
    const acceptedParams = ['pincode'];

    validator.validate('pincode', String, allowBlank=false, acceptedValues=undefined, minLength=6, maxLength=6, regex=constants.PINCODE_REGEX, required=true);
    
    req.params = commonUtils.filterObjectByAllowedKeys(req.params, acceptedParams);
    next();
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
}


//GET
const getStateListValidation = (req, res, next) => {
  try {
    const acceptedParams = [];

    req.params = commonUtils.filterObjectByAllowedKeys(req.params, acceptedParams);
    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
}


module.exports = {getCityStateValidation, getStateListValidation};