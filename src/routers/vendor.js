const express = require("express");
const dotenv = require("dotenv");


const router = new express.Router();
dotenv.config();


//internal imports
const commonUtils = require("../lib/common_utils");
const baseHelper = require("../controllers/vendor/base");
const vendorAuth = require("../middlewares/auth/vendor_auth");
const paramsMerger = require("../../config/initializers/router");
const baseParamValidator = require("../middlewares/param_validators/vendor/base");
const responseCodes = require("../lib/constants").RESPONSE_CODES;


const {vendorHelper} = baseHelper;
const {vendorParamValidator} = baseParamValidator;

router.use(paramsMerger);

//registration for vendor
router.post("/signup", vendorParamValidator.signUpParamValidation, async (req, res) => {
  try {
    await vendorHelper.handleSignup(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, "Vendor added"));
  }
  catch (err){
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


router.get("/", vendorParamValidator.getVendorParamValidation, vendorAuth, async (req, res) => {
  try {
    const vendorResponse = await vendorHelper.handleGetDetails(req.body.vendorId, req.user);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, vendorResponse, "Success"));
  } catch (err){
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//Sign-in for vendor
router.post("/login", vendorParamValidator.loginVendorParamValidation, async (req, res) => {
  try {
    const vendorLoginResponse = await vendorHelper.handleLogin(req.body);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, vendorLoginResponse.vendorObjectToExpose, vendorLoginResponse.message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode,  null, err.message));
  }
});


router.post("/logout", vendorParamValidator.logoutVendorParamValidation, vendorAuth, async (req, res) => {
  try {
    await vendorHelper.handleLogout(req.body, req.user);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Vendor Logged out"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


router.post("/create-dummy-data", vendorParamValidator.generateVendorDummyDataValidation, async (req, res) => {
  try {
    const verdictMessage = await vendorHelper.generateDummyVendors(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, verdictMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//send a new otp to vendor email
router.post("/new-email-otp", vendorParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await vendorHelper.sendEmailOtp(req.body.vendorEmail);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Vendor Email OTP sent successfully"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify the email otp of vendor
router.post("/verify-email-otp", vendorParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await vendorHelper.verifyEmailOtp(req);
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifiedEmailOtpMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


module.exports = router;
