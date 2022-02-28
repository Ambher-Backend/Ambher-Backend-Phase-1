// Internal Imports
const paramValidator = require("../../../lib/param_validator").ParamValidator;
const commonUtils = require("../../../lib/common_utils");
const responseCodes = require("../../../lib/constants").RESPONSE_CODES;


//POST
/* eslint-disable no-undef */
const listProductsValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["filter", "currentToken"];

    validator.validate("filter", Object);
    validator.validate("currentToken", String);

    const filterValidator = new paramValidator(req.body.filter);
    const acceptedFilterKeys = ["query", "isVerifiedByAdmin", "isBlocked", "pincode", "gender"];
    filterValidator.validate("query", String, allowBlank = false, acceptedValues = undefined, minLength = 1, maxLength = 50, regex = undefined, required = false);
    filterValidator.validate("isVerifiedByAdmin", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("isBlocked", Boolean, allowBlank = false, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("pincode", Array, allowBlank = true, acceptedValues = undefined, minLength = undefined, maxLength = undefined, regex = undefined, required = false);
    filterValidator.validate("gender", String, allowBlank = true, acceptedValues = ["Male", "Female", "Unisex"], minLength = undefined, maxLength = undefined, regex = undefined, required = false);

    req.body.filter = commonUtils.filterObjectByAllowedKeys(req.body.filter, acceptedFilterKeys);
    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


//GET
const viewProductDetailsValidation = (req, res, next) => {
  try {
    req.body = {
      ...req.body,
      ...req.query
    };
    const validator = new paramValidator(req.body);
    const acceptedParams = ["productId", "currentToken"];

    validator.validate("productId", String);
    validator.validate("currentToken", String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err) {
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


//POST
const verifyProductValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["productId", "currentToken"];

    validator.validate("productId", String);
    validator.validate("currentToken", String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


//POST
const blockProductValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["productId", "currentToken", "blockedReason"];

    validator.validate("productId", String);
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


module.exports = {listProductsValidation, viewProductDetailsValidation, verifyProductValidation, blockProductValidation};
