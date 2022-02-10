const relativePath = "../../..";


// Internal Imports
const paramValidator = require(`${relativePath}/lib/param_validator`).ParamValidator;
const commonUtils = require(`${relativePath}/lib/common_utils`);
const responseCodes = require(`${relativePath}/lib/constants`).RESPONSE_CODES;


//POST
/* eslint-disable no-undef */
const verifyVendorAccountValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["vendorId", "currentToken"];

    validator.validate("vendorId", String);
    validator.validate("currentToken", String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


//POST
const listVendorsValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["filter", "currentToken"];

    validator.validate("filter", Object);
    validator.validate("currentToken", String);

    // filter custom validation
    const filterValidator = new paramValidator(req.body.filter);
    filterValidator.validate("query", String, allowBlank = false, acceptedValues = undefined, minLength = 1, maxLength = 50, regex = undefined, required = false);
    filterValidator.validate("isVerified", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("isVerifiedByAdmin", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("isBlocked", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("address", Object, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


//GET
const viewVendorDetailsValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.params);
    const validator1 = new paramValidator(req.body);
    const acceptedParams = ["vendorId", "currentToken"];

    validator.validate("vendorId", String);
    validator1.validate("currentToken", String);

    req.params = commonUtils.filterObjectByAllowedKeys(req.params, acceptedParams);
    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};



//POST
const blockVendorValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["vendorId", "currentToken", "blockedReason"];

    validator.validate("vendorId", String);
    validator.validate("currentToken", String);
    validator.validate("blockedReason", String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};
/* eslint-enable */


module.exports = {verifyVendorAccountValidation, listVendorsValidation, viewVendorDetailsValidation, blockVendorValidation};
