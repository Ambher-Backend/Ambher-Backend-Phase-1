// Internal Imports
const paramValidator = require("../../../lib/param_validator").ParamValidator;
const commonUtils = require("../../../lib/common_utils");
const responseCodes = require("../../../lib/constants").RESPONSE_CODES;
const commonValidators = = require("../../../lib/param_validator");

//POST
/* eslint-disable no-undef */
const listCustomersValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["filter", "currentToken"];

    validator.validate("filter", Object);
    validator.validate("currentToken", String);

    const filterValidator = new paramValidator(req.body.filter);
    filterValidator.validate("query", String, allowBlank = false, acceptedValues = undefined, minLength = 1, maxLength = 50, regex = undefined, required = false);
    filterValidator.validate("isVerified", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("isBlocked", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


//GET
const viewCustomerDetailsValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.params);
    const validator1 = new paramValidator(req.body);
    const acceptedParams = ["customerEmail", "currentToken"];

    validator.validate("customerEmail", String);
    validator1.validate("currentToken", String);
    
    commonValidators.checkEmailFormat(req.params.customerEmail);

    req.params = commonUtils.filterObjectByAllowedKeys(req.params, acceptedParams);
    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


module.exports = {listCustomersValidation, viewCustomerDetailsValidation};
