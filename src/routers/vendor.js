const express = require("express");
const dotenv = require("dotenv");


const router = new express.Router();
dotenv.config();

//internal imports

const commonUtils = require("../lib/common_utils");
const VendorAuth = require("../middlewares/auth/vendor_auth");
const helper = require("../controllers/vendor");
const vendorParamValidator = require("../param_validators/vendor");
const responseCodes = require("../lib/constants").RESPONSE_CODES;


//registration for vendor
router.post("/signup", vendorParamValidator.signUpParamValidation, async (req, res) => {
  try {
    await helper.handleSignup(req.body);
    res.send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, "Vendor added"));
  }
  catch (err){
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


router.get("/:vendorId", vendorParamValidator.getVendorParamValidation, VendorAuth, async (req, res) => {
  try {
    const vendorResponse = await helper.handleGetDetails(req.params.vendorId);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, vendorResponse, "Success"));
  } catch (err){
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//Sign-in for vendor
router.post("/login", vendorParamValidator.loginVendorParamValidation, async (req, res) => {
  try {
    const vendorLoginResponse = await helper.handleLogin(req.body);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, vendorLoginResponse.vendorObjectToExpose, vendorLoginResponse.message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode,  null, err.message));
  }
});


router.post("/logout", vendorParamValidator.logoutVendorParamValidation, VendorAuth, async (req, res) => {
  try {
    await helper.handleLogout(req.body, req.user);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Vendor Logged out"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


router.post("/create-dummy-data", vendorParamValidator.generateVendorDummyDataValidation, async (req, res) => {
  try {
    const verdictMessage = await helper.generateDummyVendors(req.body);
    res.send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, verdictMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//send a new otp to vendor email
router.post("/new-email-otp", vendorParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await helper.sendEmailOtp(req.body.vendorEmail);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Vendor Email OTP sent successfully"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify the email otp of vendor
router.post("/verify-email-otp", vendorParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifiedEmailOtpMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


module.exports = router;
