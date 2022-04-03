// Internal Imports
const paramValidator = require("../../../lib/param_validator").ParamValidator;
const commonUtils = require("../../../lib/common_utils");
const constants = require("../../../lib/constants");


//GET
// TODO: Remove this ignore and fix named variables issue
/* eslint-disable no-undef */
const getCityStateValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["pincode"];

    validator.validate("pincode", String, allowBlank = false, acceptedValues = undefined, minLength = 6, maxLength = 6, regex = constants.PINCODE_REGEX, required = true);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
};


//GET
const getStateListValidation = (req, res, next) => {
  try {
    const acceptedParams = [];

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
};
/* eslint-enable */

module.exports = {getCityStateValidation, getStateListValidation};
