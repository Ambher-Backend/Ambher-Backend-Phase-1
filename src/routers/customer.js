const express = require("express");


// Router Config
const router = new express.Router();


//internal imports
const commonUtils = require("../lib/common_utils");
const helper = require("../controllers/customer");
const CustomerAuth = require("../middlewares/auth/customer_auth");
const customerParamValidator = require("../param_validators/customer");
const responseCodes = require("../lib/constants").RESPONSE_CODES;


//signup route
router.post("/signup", customerParamValidator.signUpParamValidation, async (req, res) => {
  try {
    await helper.handleSignup(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, "Customer Created"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//login route
router.post("/login", customerParamValidator.loginCustomerParamValidation, async (req, res) => {
  try {
    const customerLoginResponse = await helper.handleLogin(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customerLoginResponse.customerObjectToExpose, customerLoginResponse.message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//logout route
router.post("/logout", customerParamValidator.logoutCustomerParamValidation, CustomerAuth, async (req, res) => {
  try {
    await helper.handleLogout(req.body, req.user);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Customer Logged out"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//generate dummy data route
router.post("/create-dummy-data", customerParamValidator.generateCustomerDummyDataValidation, async (req, res) => {
  try {
    const verdict = await helper.generateDummyCustomers(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, verdict));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//get route for Customer details
router.get("/:customerId", customerParamValidator.getCustomerParamValidation, CustomerAuth, async (req, res) => {
  try {
    const customerResponse = await helper.handleGetDetails(req.params.customerId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customerResponse, "Success"));
  } catch (err){
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//send a new otp to customer email
router.post("/new-email-otp", customerParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await helper.sendEmailOtp(req.body.customerEmail);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Customer Email OTP sent successfully"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify customer email otp
router.post("/verify-email-otp", customerParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifiedEmailOtpMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


module.exports = router;
