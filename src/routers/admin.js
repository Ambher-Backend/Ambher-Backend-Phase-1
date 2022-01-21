const express = require('express');
const config = require('config');
const dotenv = require('dotenv');
const validator = require('validator');
const mongoose = require('mongoose');

// Router Config
const router = new express.Router();
dotenv.config();


//internal imports
const Admin = require('../models/admin');
const helper = require('../controllers/admin');
const commonUtils = require('../lib/common_utils');
const AdminAuth = require('../middlewares/auth/admin_auth');


//signup route
router.post('/signup', async (req, res)=>{
	try {
		if(req.body.password.length<8) {
			throw new Error('Weak Password');
		}
		if(req.body.phoneNumber.length != 10 || req.body.phoneNumber.match(/[0-9]{10}/)[0] != req.body.phoneNumber) {
			throw new Error('Invalid Phone Number');
		}
		if(!validator.isEmail(req.body.email)) {
			throw new Error('Invalid Mail');
		}

		const admin = new Admin(req.body);
		await admin.save();
		res.send(commonUtils.responseUtil(201, null, "Admin Created"));

	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//get route for admin details
router.get('/:adminId', AdminAuth, async (req, res) => {
	try{
		if (req.params.adminId === undefined){
			throw new Error('Id not found');
		}
		const adminResponse = await helper.handleGetDetails(req.params.adminId);
		res.send(commonUtils.responseUtil(200, adminResponse, "Success"));
	}catch(err){
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


//login route
router.post('/login',async (req, res) => {
	try {
		const adminLoginResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, adminLoginResponse.adminObjectToExpose, adminLoginResponse.message));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});


//logout route
router.post('/logout', AdminAuth, async (req, res) => {
	try{
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Admin Logged out"));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});


//generate dummy data route
router.post('/create-dummy-data', async (req, res) => {
	try {
		if (config.util.getEnv('NODE_ENV') == 'production'){
			throw new Error('Dummy Data Creation Not Allowed on Production Server');
		}
		if (req.body.internalAuthKey === undefined || req.body.internalAuthKey !== process.env.INTERNAL_AUTH_ID){
			throw new Error('Un-authorized access');
		}
		await helper.generateDummyAdmins(req.body);
		res.send(commonUtils.responseUtil(201, null, 'Data Created'));
	} catch(err) {
		console.log(err);
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//send a new otp to admin email
router.post('/new-email-otp', async(req, res) => {
	try {
		await helper.sendEmailOtp(req.body.adminEmail);
		res.send(commonUtils.responseUtil(200, null, "Admin Email OTP sent successfully"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});

//verify the email otp of admin
router.post('/verify-email-otp', async(req, res) => {
	try {
		const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req);
		res.send(commonUtils.responseUtil(400, null, verifiedEmailOtpMessage));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})


module.exports = router;