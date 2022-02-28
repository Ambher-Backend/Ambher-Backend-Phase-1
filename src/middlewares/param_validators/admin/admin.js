const config = require("config");


// Internal Imports
const paramValidator = require("../../../lib/param_validator").ParamValidator;
const commonValidators = require("../../../lib/param_validator");
const commonUtils = require("../../../lib/common_utils");
const responseCodes = require("../../../lib/constants").RESPONSE_CODES;


// POST
// TODO: Remove this ignore and fix named variables issue
/* eslint-disable no-undef */
const signUpParamValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["name", "phoneNumber", "email", "password"];

    validator.validate("name", String, allowBlank = false, acceptedValues = undefined, minLength = 1, maxLength = 50);
    validator.validate("phoneNumber", String, allowBlank = false, acceptedValues = undefined, minLength = 10, maxLength = 10);
    validator.validate("email", String);
    validator.validate("password", String, allowBlank = false, acceptedValues = undefined, minLength = 8);

    commonValidators.checkEmailFormat(req.body.email);
    commonValidators.checkPhoneNumber(req.body.phoneNumber);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// LOGIN
const loginAdminParamValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["email", "password"];

    validator.validate("email", String);
    validator.validate("password", String);

    commonValidators.checkEmailFormat(req.body.email);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// POST
const logoutAdminParamValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["currentToken"];

    validator.validate("currentToken", String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// GET
const getAdminParamValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["adminId", "currentToken"];

    validator.validate("adminId", String);
    validator.validate("currentToken", String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// POST
const generateAdminDummyDataValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["internalAuthKey", "deleteExisting", "total"];

    validator.validate("internalAuthKey", String);
    validator.validate("deleteExisting", Boolean, allowBlank = false, acceptedValues = [true, false]);
    validator.validate("total", Number, allowBlank = false, acceptedValues = undefined, minLength = 1, maxLength = 50, regex = undefined, required = false);


    commonValidators.checkInternalAuthKey(req.body.internalAuthKey);
    if (config.util.getEnv("NODE_ENV") === "production"){
      throw commonUtils.generateError(responseCodes.UNPROCESSABLE_ERROR_CODE, "Dummy Data Creation Not Allowed on Production Server");
    }

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = err.status || responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// POST
const sendEmailOtpValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["adminEmail"];

    validator.validate("adminEmail", String);

    commonValidators.checkEmailFormat(req.body.adminEmail);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// POST
const verifyEmailOtpValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["adminEmail", "otp"];

    validator.validate("adminEmail", String);
    validator.validate("otp", String);

    commonValidators.checkEmailFormat(req.body.adminEmail);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};
/* eslint-enable */


module.exports = {signUpParamValidation, loginAdminParamValidation, getAdminParamValidation,
  logoutAdminParamValidation, generateAdminDummyDataValidation, sendEmailOtpValidation,
  verifyEmailOtpValidation};
