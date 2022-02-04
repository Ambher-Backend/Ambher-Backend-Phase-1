const config = require("config");


// Internal Imports
const paramValidator = require("../lib/param_validator").ParamValidator;
const commonValidators = require("../lib/param_validator");
const commonUtils = require("../lib/common_utils");


// POST
// TODO: Remove this ignore and fix named variables issue
/* eslint-disable no-undef */
const generateDocumentDummyDataValidation = (req, res, next) => {
  try{
    const validator = new paramValidator(req.body);
    const acceptedParams = ["internalAuthKey", "deleteExisting", "total"];

    validator.validate("internalAuthKey", String);
    validator.validate("deleteExisting", Boolean, allowBlank=false, acceptedValues=[true, false]);
    validator.validate("total", Number, allowBlank=false, acceptedValues=undefined, minLength=1, maxLength=50, regex=undefined, required=false);

    commonValidators.checkInternalAuthKey(req.body.internalAuthKey);
    if (config.util.getEnv("NODE_ENV") === "production"){
			throw new Error("Dummy Data Creation Not Allowed on Production Server");
		}

    req.body = commonUtils.filterObjectByAllowedKeys(req.body, acceptedParams);
    next();
  }catch(err){
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
};
/* eslint-enable */


module.exports = {generateDocumentDummyDataValidation};
