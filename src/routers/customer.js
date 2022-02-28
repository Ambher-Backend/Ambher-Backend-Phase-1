const express = require("express");


// Router Config
const router = new express.Router();


//internal imports
const commonUtils = require("../lib/common_utils");
const baseHelper = require("../controllers/customer/base");
const paramsMerger = require("../../config/initializers/router");
const customerAuth = require("../middlewares/auth/customer_auth");
const baseParamValidator = require("../middlewares/param_validators/customer/base");
const responseCodes = require("../lib/constants").RESPONSE_CODES;


const {customerHelper} = baseHelper;
const  {customerParamValidator} = baseParamValidator;

router.use(paramsMerger);

//signup route
router.post("/signup", customerParamValidator.signUpParamValidation, async (req, res) => {
  try {
    await customerHelper.handleSignup(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, "Customer Created"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//login route
router.post("/login", customerParamValidator.loginCustomerParamValidation, async (req, res) => {
  try {
    const customerLoginResponse = await customerHelper.handleLogin(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customerLoginResponse.customerObjectToExpose, customerLoginResponse.message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//logout route
router.post("/logout", customerParamValidator.logoutCustomerParamValidation, customerAuth, async (req, res) => {
  try {
    await customerHelper.handleLogout(req.body, req.user);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Customer Logged out"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//generate dummy data route
router.post("/create-dummy-data", customerParamValidator.generateCustomerDummyDataValidation, async (req, res) => {
  try {
    const verdict = await customerHelper.generateDummyCustomers(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, verdict));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//get route for Customer details
router.get("/", customerParamValidator.getCustomerParamValidation, customerAuth, async (req, res) => {
  try {
    const customerResponse = await customerHelper.handleGetDetails(req.body.customerId, req.user);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customerResponse, "Success"));
  } catch (err){
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//send a new otp to customer email
router.post("/new-email-otp", customerParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await customerHelper.sendEmailOtp(req.body.customerEmail);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Customer Email OTP sent successfully"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify customer email otp
router.post("/verify-email-otp", customerParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await customerHelper.verifyEmailOtp(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifiedEmailOtpMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


module.exports = router;
