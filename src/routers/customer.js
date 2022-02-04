const express = require('express');


// Router Config
const router = new express.Router();


//internal imports
const commonUtils = require('../lib/common_utils');
const helper = require('../controllers/customer');
const CustomerAuth = require('../middlewares/auth/customer_auth');
const customerParamValidator = require('../param_validators/customer');


//signup route
router.post('/signup',customerParamValidator.signUpParamValidation, async (req, res) => {
	try {
		await helper.handleSignup(req.body);
  		res.send(commonUtils.responseUtil(201, null, "Customer Created"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//login route
router.post('/login', customerParamValidator.loginCustomerParamValidation, async (req, res) => {
	try {
		const customerLoginResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, customerLoginResponse.customerObjectToExpose, customerLoginResponse.message));
	} catch (err) {
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});


//logout route
router.post('/logout', customerParamValidator.logoutCustomerParamValidation, CustomerAuth, async (req, res) => {
	try{
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Customer Logged out"));
	} catch(err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});


//generate dummy data route
router.post('/create-dummy-data', customerParamValidator.generateCustomerDummyDataValidation, async (req, res) => {
	try {
		const verdict = await helper.generateDummyCustomers(req.body);
		res.send(commonUtils.responseUtil(201, null, verdict));
	} catch(err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//get route for Customer details
router.get('/:customerId', customerParamValidator.getCustomerParamValidation, CustomerAuth, async (req, res) => {
	try{
		const customerResponse = await helper.handleGetDetails(req.params.customerId);
		res.send(commonUtils.responseUtil(200, customerResponse, "Success"));
	}catch(err){
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


//send a new otp to customer email
router.post('/new-email-otp', customerParamValidator.sendEmailOtpValidation, async(req, res) => {
	try {
		await helper.sendEmailOtp(req.body.customerEmail);
		res.send(commonUtils.responseUtil(200, null, "Customer Email OTP sent successfully"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify customer email otp
router.post('/verify-email-otp', customerParamValidator.verifyEmailOtpValidation, async(req, res) => {
	try {
		const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req.body);
		res.send(commonUtils.responseUtil(200, null, verifiedEmailOtpMessage));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


module.exports = router;