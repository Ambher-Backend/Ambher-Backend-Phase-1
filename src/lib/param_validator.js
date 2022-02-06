const validator = require("validator");
const dotenv = require("dotenv");
dotenv.config();


//internal imports
const responseCodes = require('../lib/constants').RESPONSE_CODES;
const commonUtils = require('../lib/common_utils');


class ParamValidator{
  constructor(reqBody){
    this.reqBody = reqBody;
  }

  
  // paramName -> name of the parameter to be checked in request body
  // type -> expected type of the parameter
  // checkBlank -> works for string and array parameter and check if the value is not blank
  // acceptedValues -> acceptable values of the parameter(optional)(Array)
  // minLength and maxLength are for string and array, if any other data type is passed, then it may cause errors.
  // regex -> for String, validates by regex 
  // required ->  field indicates, if the current parameter is required.
  validate(paramName, type, allowBlank = false, acceptedValues = undefined, minLength = undefined,
    maxLength = undefined, regex = undefined, required = true) {
    this.checkPresence(paramName, required = required);
    if (!required && this.reqBody[paramName] === undefined){ return; }
    this.checkType(paramName, type);
    this.checkBlank(paramName, allowBlank);
    this.checkAcceptedValues(paramName, acceptedValues);
    this.checkByRegex(paramName, regex);
    this.checkLength(paramName, minLength, maxLength);
  }


  // validates the presence of a validator
  checkPresence(paramName, required=true){
    if (required && this.reqBody[paramName] === undefined){
      throw new Error(`Required Parameter: |${paramName}| is not present.`);
    }
  }


  // validates the type of parameter  
  checkType(paramName, type){
    if (this.reqBody[paramName].constructor !== type){
      throw new Error(`Parameter: |${paramName}| data type is invalid.`);
    }
  }


  // validates if the value of the param is in accepted values
  checkAcceptedValues(paramName, acceptedValues){
    if (!(this.reqBody[paramName].constructor === String || this.reqBody[paramName].constructor === Array)){
      return;
    }
    if (acceptedValues !== undefined && acceptedValues.find( acceptedValue => (acceptedValue === this.reqBody[paramName])) === undefined){
      throw new Error(`${this.reqBody[paramName]} for parameter: ${paramName} is not accepted.`);
    }
  }


  // check if the value of the parameter is empty incase of String, or Array
  checkBlank(paramName, allowBlank){
    if (allowBlank){
      return;
    }
    if (this.reqBody[paramName].constructor === String || this.reqBody[paramName].constructor === Array){
      if (this.reqBody[paramName].length === 0){
        throw new Error(`${[paramName]} can't be blank!`);
      }
    }
  }


  // check if the length of iterable is in range
  checkLength(paramName, min, max){
    if (min !== undefined || max !== undefined){
      if (min !== undefined && this.reqBody[paramName].length < min){
        throw new Error(`${paramName}'s size can't be less than ${min}`);
      }
      if (max !== undefined && this.reqBody[paramName].length > max){
        throw new Error(`${paramName}'s size can't be more than ${max}`);
      }
    }
  }


  // check if the string parameter matches the regex
  checkByRegex(paramName, regex){
    if (regex !== undefined && this.reqBody[paramName].constructor === String){
      if (this.reqBody[paramName].match(regex) === undefined){
        throw new Error(`Invalid format for parameter ${paramName}`);
      }
    }
  }
}


// checks email format.
const checkEmailFormat = (email) => {
  if (!validator.isEmail(email)){
    throw commonUtils.generateError(responseCodes.BAD_REQUEST_CODE,"Email is not valid");
  }
};


// check indian phone number
const checkPhoneNumber = (phoneNumber) => {
  if (!validator.isMobilePhone(phoneNumber, ["en-IN"])){
    throw commonUtils.generateError(responseCodes.BAD_REQUEST_CODE,"Phone Number is Invalid");
  }
};


// check internal authorization key
const checkInternalAuthKey = (key) => {
  if (key !== process.env.INTERNAL_AUTH_ID){
    throw commonUtils.generateError(responseCodes.UNAUTHORISED_ERROR_CODE,"Un-authorized action");
  }
};


module.exports = {ParamValidator, checkEmailFormat, checkPhoneNumber, checkInternalAuthKey};
