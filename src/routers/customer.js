const express = require('express');
const config = require('config');
const dotenv = require('dotenv');
const validator = require('validator');
const mongoose = require('mongoose');


// Router Config
const router = new express.Router();
dotenv.config();


//internal imports
const Customer = require('../models/customer');
const commonUtils = require('../lib/common_utils');
const helper = require('../controllers/customer');
const CustomerAuth = require('../middlewares/auth/customer_auth');
const customerParamValidator = require('../param_validators/customer');


//signup route
router.post('/signup',customerParamValidator.signUpParamValidation,async (req, res) => {
    try {
        await helper.handleSignup(req.body);
        res.send(commonUtils.responseUtil(201, null, "Customer Created"));
        
	} catch (err) {
        commonUtils.errorLog(err.message);
        res.send(commonUtils.responseUtil(400, null, err.message));
    }
});


//login route
router.post('/login',customerParamValidator.loginCustomerParamValidation, async (req, res) => {
	try {
		const customerLoginResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, customerLoginResponse.customerObjectToExpose, customerLoginResponse.message));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});


//logout route
router.post('/logout', customerParamValidator.logoutCustomerParamValidation,CustomerAuth, async (req, res) => {
	try{
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Customer Logged out"));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});


//generate dummy data route
router.post('/create-dummy-data',customerParamValidator.generateCustomerDummyDataValidation, async (req, res) => {
	try {
		if (config.util.getEnv('NODE_ENV') == 'production'){
			throw new Error('Dummy Data Creation Not Allowed on Production Server');
		}
		if (req.body.internalAuthKey === undefined || req.body.internalAuthKey !== process.env.INTERNAL_AUTH_ID){
			throw new Error(`Un-authorized access`);
		}
		await helper.generateDummyCustomers(req.body);
		res.send(commonUtils.responseUtil(201, null, 'Data Created'));
	} catch(err) {
		console.log(err);
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//get route for Customer details
router.get('/:customerId',customerParamValidator.getCustomerParamValidation, CustomerAuth, async (req, res) => {
	try{
		if (req.params.customerId === undefined){
			throw new Error('Id not found');
		}
		const customerResponse = await helper.handleGetDetails(req.params.customerId);
		res.send(commonUtils.responseUtil(200, customerResponse, "Success"));
	}catch(err){
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


//send a new otp to customer email
router.post('/new-email-otp',customerParamValidator.sendEmailOtpValidation, async(req, res) => {
	try {
		await helper.sendEmailOtp(req.body.customerEmail);
		res.send(commonUtils.responseUtil(200, null, "Customer Email OTP sent successfully"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify customer email otp
router.post('/verify-email-otp',customerParamValidator.VerifyEmailOtpValidation, async(req, res) => {
	try {
		const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req);
		res.send(commonUtils.responseUtil(400, null, verifiedEmailOtpMessage));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


module.exports = router;