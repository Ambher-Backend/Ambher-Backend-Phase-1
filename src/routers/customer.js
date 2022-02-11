const express = require("express");


// Router Config
const router = new express.Router();


//internal imports
const commonUtils = require("../lib/common_utils");
const baseHelper = require("../controllers/customer/base");
const customerAuth = require("../middlewares/auth/customer_auth");
const baseParamValidator = require("../middlewares/param_validators/customer/base");


const {customerHelper} = baseHelper;
const {customerParamValidator} = baseParamValidator;


//signup route
router.post("/signup", customerParamValidator.signUpParamValidation, async (req, res) => {
  try {
    await customerHelper.handleSignup(req.body);
    res.send(commonUtils.responseUtil(201, null, "Customer Created"));
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


//login route
router.post("/login", customerParamValidator.loginCustomerParamValidation, async (req, res) => {
  try {
    const customerLoginResponse = await customerHelper.handleLogin(req.body);
    res.send(commonUtils.responseUtil(200, customerLoginResponse.customerObjectToExpose, customerLoginResponse.message));
  } catch (err) {
    res.send(commonUtils.responseUtil(400,  null, err.message));
  }
});


//logout route
router.post("/logout", customerParamValidator.logoutCustomerParamValidation, customerAuth, async (req, res) => {
  try {
    await customerHelper.handleLogout(req.body, req.user);
    res.send(commonUtils.responseUtil(200, null, "Customer Logged out"));
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


//generate dummy data route
router.post("/create-dummy-data", customerParamValidator.generateCustomerDummyDataValidation, async (req, res) => {
  try {
    const verdict = await customerHelper.generateDummyCustomers(req.body);
    res.send(commonUtils.responseUtil(201, null, verdict));
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


//get route for Customer details
router.get("/:customerId", customerParamValidator.getCustomerParamValidation, customerAuth, async (req, res) => {
  try {
    const customerResponse = await customerHelper.handleGetDetails(req.params.customerId);
    res.send(commonUtils.responseUtil(200, customerResponse, "Success"));
  } catch (err){
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


//send a new otp to customer email
router.post("/new-email-otp", customerParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await customerHelper.sendEmailOtp(req.body.customerEmail);
    res.send(commonUtils.responseUtil(200, null, "Customer Email OTP sent successfully"));
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


//verify customer email otp
router.post("/verify-email-otp", customerParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await customerHelper.verifyEmailOtp(req.body);
    res.send(commonUtils.responseUtil(200, null, verifiedEmailOtpMessage));
  } catch (err) {
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


module.exports = router;
