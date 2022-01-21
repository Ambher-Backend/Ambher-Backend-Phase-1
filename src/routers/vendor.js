const mongoose = require("mongoose");
const express = require("express");
const config = require('config');
const dotenv = require('dotenv');
const validator = require('validator');

const router = new express.Router();
dotenv.config();

//internal imports

const commonUtils = require('../lib/common_utils');
const VendorAuth = require('../middlewares/auth/vendor_auth');
const Vendor = require('../models/vendor');
const helper = require('../controllers/vendor');

//registration for vendor
router.post('/signup',async function(req,res){
    try{
        if(req.body.phoneNumber.length != 10 || req.body.phoneNumber.match(/[0-9]{10}/)[0] != req.body.phoneNumber) {
	throw new Error('Invalid Phone Number');
        }
        if(req.body.password.length < 8){
            throw new error("Password length not sufficient");
        }
        if(!validator.isEmail(req.body.email)){
            throw new error("Enter valid emailId");
        }
        const vendor = new Vendor(req.body);    
        await vendor.save();
        res.send(commonUtils.responseUtil(201, null, "Vendor added"));

    }
    catch (err){
        commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
    }

});

router.get('/:vendorId',VendorAuth, async (req, res) => {
	try{
		if (req.params.vendorId === undefined){
			throw new Error('Id not found');
		}
		const vendorResponse = await helper.handleGetDetails(req.params.vendorId);
		res.send(commonUtils.responseUtil(200, vendorResponse, "Success"));
	}catch(err){
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})

//Sign-in for vendor
router.post('/login',async (req, res) => {
	try {
		const vendorLoginResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, vendorLoginResponse.vendorObjectToExpose, vendorLoginResponse.message));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});

router.post('/logout', VendorAuth, async (req, res) => {
	try{
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Vendor Logged out"));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});

router.post('/create-dummy-data', async (req, res) => {
	try {
		if (config.util.getEnv('NODE_ENV') == 'production'){
			throw new Error('Dummy Data Creation Not Allowed on Production Server');
		}
		if (req.body.internalAuthKey === undefined || req.body.internalAuthKey !== process.env.INTERNAL_AUTH_ID){
			throw new Error(`Un-authorized access`);
		}
		await helper.generateDummyVendors(req.body);
		res.send(commonUtils.responseUtil(201, null, 'Data Created'));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//send a new otp to vendor email
router.post('/new-email-otp', async(req, res) => {
	try {
		await helper.sendEmailOtp(req.body.vendorEmail);
		res.send(commonUtils.responseUtil(200, null, "Vendor Email OTP sent successfully"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify the email otp of vendor
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
