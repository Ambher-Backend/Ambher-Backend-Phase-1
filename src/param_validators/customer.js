const config = require('config');


// Internal Imports
const paramValidator = require('../lib/param_validator').ParamValidator;
const commonValidators = require('../lib/param_validator');
const commonUtils = require('../lib/common_utils');


// POST
const signUpParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['name', 'phoneNumber', 'email', 'password','dob'];

    validator.validate('name', String, allowBlank=false, acceptedValues=undefined, minLength=1, maxLength=50);
    validator.validate('phoneNumber', String, allowBlank=false, acceptedValues=undefined, minLength=10, maxLength=10);
    validator.validate('email', String);
    validator.validate('password', String, allowBlank=false, acceptedValues=undefined, minLength=8);
    validator.validate('dob',String);

    commonValidators.checkEmailFormat(req.body.email);
    commonValidators.checkPhoneNumber(req.body.phoneNumber);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
};


// LOGIN
const loginCustomerParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['email', 'password'];

    validator.validate('email', String);
    validator.validate('password', String);

    commonValidators.checkEmailFormat(req.body.email);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const logoutCustomerParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['currentToken'];

    validator.validate('currentToken', String);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// GET
const getCustomerParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.params);
    const validator1 = new paramValidator(req.body);
    const acceptedParams = ['currentToken'];
    const acceptedParams1 = ['customerId'];

    validator.validate('customerId', String);
    validator1.validate('currentToken', String);

    req.params = commonUtils.filterObjectByAllowedKeys(req.params,acceptedParams1);
    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const generateCustomerDummyDataValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['internalAuthKey', 'deleteExisting', 'total'];

    validator.validate('internalAuthKey', String);
    validator.validate('deleteExisting', Boolean, allowBlank=false, acceptedValues=[true, false]);
    validator.validate('total', Number, allowBlank=false, acceptedValues=undefined, minLength=1, maxLength=50, regex=undefined, required=false);


    commonValidators.checkInternalAuthKey(req.body.internalAuthKey);
    if (config.util.getEnv('NODE_ENV') == 'production'){
			throw new Error('Dummy Data Creation Not Allowed on Production Server');
		}

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const sendEmailOtpValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['customerEmail'];

    validator.validate('customerEmail', String);

    commonValidators.checkEmailFormat(req.body.customerEmail);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const verifyEmailOtpValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['customerEmail', 'otp'];

    validator.validate('customerEmail', String);
    validator.validate('otp', String);

    commonValidators.checkEmailFormat(req.body.customerEmail);

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


module.exports = {signUpParamValidation, loginCustomerParamValidation, getCustomerParamValidation,
logoutCustomerParamValidation, generateCustomerDummyDataValidation, sendEmailOtpValidation,
verifyEmailOtpValidation};