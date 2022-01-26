const express = require('express');

// Router Config
const router = new express.Router();


//internal imports
const helper = require('../controllers/admin');
const commonUtils = require('../lib/common_utils');
const adminParamValidator = require('../param_validators/admin');
const AdminAuth = require('../middlewares/auth/admin_auth');


//signup route
router.post('/signup', adminParamValidator.signUpParamValidation, async (req, res)=>{
	try {
		await helper.handleSignup(req.body);
		res.send(commonUtils.responseUtil(201, null, "Admin Created"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//get route for admin details
router.get('/:adminId', adminParamValidator.getAdminParamValidation, AdminAuth, async (req, res) => {
	try{
		const adminResponse = await helper.handleGetDetails(req.params.adminId);
		res.send(commonUtils.responseUtil(200, adminResponse, "Success"));
	}catch(err){
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


//login route
router.post('/login', adminParamValidator.loginAdminParamValidation, async (req, res) => {
	try {
		const adminLoginResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, adminLoginResponse.adminObjectToExpose, adminLoginResponse.message));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});


//logout route
router.post('/logout', adminParamValidator.logoutAdminParamValidation, AdminAuth, async (req, res) => {
	try{
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Admin Logged out"));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});


//generate dummy data route
router.post('/create-dummy-data', adminParamValidator.generateAdminDummyDataValidation, async (req, res) => {
	try {
		const message = await helper.generateDummyAdmins(req.body);
		res.send(commonUtils.responseUtil(201, null, message));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(500, null, err.message));
	}
});


//send a new otp to admin email
router.post('/new-email-otp', adminParamValidator.sendEmailOtpValidation, async(req, res) => {
	try {
		await helper.sendEmailOtp(req.body.adminEmail);
		res.send(commonUtils.responseUtil(200, null, "Admin Email OTP sent successfully"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify the email otp of admin
router.post('/verify-email-otp', adminParamValidator.verifyEmailOtpValidation, async (req, res) => {
	try {
		const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req.body);
		res.send(commonUtils.responseUtil(200, null, verifiedEmailOtpMessage));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


//verify vendor account
router.post('/verify-vendor', adminParamValidator.verifyVendorAccountValidation, AdminAuth, async (req, res) => {
	try {
		const verifyVendorAccountMessage = await helper.verifyVendor(req.user, req.body);
		res.send(commonUtils.responseUtil(200, null, verifyVendorAccountMessage));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


router.post('/vendors', adminParamValidator.listVendorsValidation, AdminAuth, async (req, res) => {
	try{
		const filteredVendors = await helper.listVendors(req.body);
		res.send(commonUtils.responseUtil(200, filteredVendors, 'filteredVendors'));
	}catch(err){
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


module.exports = router;