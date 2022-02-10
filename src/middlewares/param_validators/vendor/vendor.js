const config = require("config");


const relativePath = "../../..";


// Internal Imports
const paramValidator = require(`${relativePath}/lib/param_validator`).ParamValidator;
const commonValidators = require(`${relativePath}/lib/param_validator`);
const commonUtils = require(`${relativePath}/lib/common_utils`);
const responseCodes = require(`${relativePath}/lib/constants`).RESPONSE_CODES;


// POST
// TODO: Remove this ignore and fix named variables issue
/* eslint-disable no-undef */
const signUpParamValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.body);
    const acceptedParams = ["name", "phoneNumber", "email", "password", "dob", "address"];

    validator.validate("name", String, allowBlank = false, acceptedValues = undefined, minLength = 1, maxLength = 50);
    validator.validate("phoneNumber", String, allowBlank = false, acceptedValues = undefined, minLength = 10, maxLength = 10);
    validator.validate("email", String);
    validator.validate("password", String, allowBlank = false, acceptedValues = undefined, minLength = 8);
    validator.validate("dob", String);
    validator.validate("address", Object);

    commonValidators.checkEmailFormat(req.body.email);
    commonValidators.checkPhoneNumber(req.body.phoneNumber);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// POST
const loginVendorParamValidation = (req, res, next) => {
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
const logoutVendorParamValidation = (req, res, next) => {
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
const getVendorParamValidation = (req, res, next) => {
  try {
    const validator = new paramValidator(req.params);
    const validator1 = new paramValidator(req.body);
    const acceptedParams = ["vendorId", "currentToken"];

    validator.validate("vendorId", String);
    validator1.validate("currentToken", String);

    req.params = commonUtils.filterObjectByAllowedKeys(req.params, acceptedParams);
    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


// POST
const generateVendorDummyDataValidation = (req, res, next) => {
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
    const acceptedParams = ["vendorEmail"];

    validator.validate("vendorEmail", String);

    commonValidators.checkEmailFormat(req.body.vendorEmail);

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
    const acceptedParams = ["vendorEmail", "otp"];

    validator.validate("vendorEmail", String);
    validator.validate("otp", String);

    commonValidators.checkEmailFormat(req.body.vendorEmail);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  } catch (err){
    const statusCode = responseCodes.BAD_REQUEST_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};
/* eslint-enable */


module.exports = {signUpParamValidation, loginVendorParamValidation, getVendorParamValidation,
  logoutVendorParamValidation, generateVendorDummyDataValidation, sendEmailOtpValidation,
  verifyEmailOtpValidation};
