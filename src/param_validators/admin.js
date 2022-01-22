const config = require('config');



// Internal Imports
const paramValidator = require('../lib/param_validator').ParamValidator;
const commonValidators = require('../lib/param_validator');
const commonUtils = require('../lib/common_utils');


// POST
const signUpParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['name', 'phoneNumber', 'email', 'password'];

    validator.validate('name', String, allowBlank=false, acceptedValues=undefined, minLength=1, maxLength=50);
    validator.validate('phoneNumber', String, allowBlank=false, acceptedValues=undefined, minLength=10, maxLength=10);
    validator.validate('email', String);
    validator.validate('password', String, allowBlank=false, acceptedValues=undefined, minLength=8);

    commonValidators.checkEmailFormat(req.body.email);
    commonValidators.checkPhoneNumber(req.body.phoneNumber);
    
    req.body = commonUtils.filterObjectKeys(req.body, acceptedParams);
    console.log(commonUtils.filterObjectKeys(req.body, acceptedParams));
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
};


// LOGIN
const loginAdminParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['email', 'password'];

    validator.validate('email', String);
    validator.validate('password', String);

    commonValidators.checkEmailFormat(req.body.email);

    req.body = commonUtils.filterObjectKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const logoutAdminParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['currentToken'];

    validator.validate('currentToken', String);
    
    req.params = commonUtils.filterObjectKeys(req.params, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// GET
const getAdminParamValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.params);
    const validator1 = new paramValidator(req.body);
    const acceptedParams = ['adminId', 'currentToken'];

    validator.validate('adminId', String);
    validator1.validate('currentToken', String);
    
    req.params = commonUtils.filterObjectKeys(req.params, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const generateAdminDummyDataValidation = (req, res, next) => {
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

    req.body = commonUtils.filterObjectKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const sendEmailOtpValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['adminEmail'];

    validator.validate('adminEmail', String);

    commonValidators.checkEmailFormat(req.body.adminEmail);

    req.body = commonUtils.filterObjectKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


// POST
const VerifyEmailOtpValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ['adminEmail', 'otp'];

    validator.validate('adminEmail', String);
    validator.validate('otp', String);

    commonValidators.checkEmailFormat(req.body.adminEmail);

    req.body = commonUtils.filterObjectKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message))
  }
}


module.exports = {signUpParamValidation, loginAdminParamValidation, getAdminParamValidation,
logoutAdminParamValidation, generateAdminDummyDataValidation, sendEmailOtpValidation,
VerifyEmailOtpValidation};