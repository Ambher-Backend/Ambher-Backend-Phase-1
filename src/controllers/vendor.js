const mongoose = require("mongoose");
const faker = require("faker");
const validator = require("validator");


//Internal Imports
const Vendor = require('../models/vendor');
const commonUtils = require('../lib/common_utils');
const emailUtils = require('../lib/send_email');
const seeder = require('../../config/database/seeder');


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email','profilePictureUrl','dob','address'],
	'toVerifyEmail': ['email'],
	'toVerifyAccount': ['_id', 'name', 'email','profilePictureUrl','dob','address', 'isVerifiedByAdmin'],
	'blocked' : ['name','email','blockedReason'],
	'get':['_id', 'name', 'email', 'phoneNumber','profilePictureUrl','dob','address']
};


const handleLogin = async (reqBody) => {
	let vendorResponse = await Vendor.findByCredentials(reqBody.email, reqBody.password);
	if (vendorResponse.isVerified === false) {
		const vendorObjectToExpose = filterKeys(vendorResponse, 'toVerify');	
		const message = "Vendor Email needs to be verified";
		return {vendorObjectToExpose, message};
	}
	if (vendorResponse.isBlocked === true) {
		const vendorObjectToExpose = filterKeys(vendorResponse, 'blocked');	
		const message = "Vendor Blocked. Contact Support";
		return {vendorObjectToExpose, message};
	}
	if (vendorResponse.isVerifiedByAdmin === false) {
		const vendorObjectToExpose = filterKeys(vendorResponse, 'toVerifyAccount');
		const message = "Vendor Unverified by admin";
		return {vendorObjectToExpose, message};
	}
	const token = await vendorResponse.generateToken();
	const vendorObjectToExpose = filterKeys(vendorResponse, 'postLogin');
	vendorObjectToExpose['token'] = token;
	const message = "Vendor Login Successful";
	return {vendorObjectToExpose, message};
};


const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token != reqBody.currentToken));
	currentUser.currentToken = '';
	await currentUser.save();
	return;
};


const handleGetDetails = async (vendorId) => {
	const vendor = await Vendor.findById(vendorId);
	const vendorObjectToExpose = filterKeys(vendor, 'get');
	return vendorObjectToExpose;
};


//function to generate 10 vendor data or on the basis of request
const generateDummyVendors = async (reqBody) => {
	const verdict = await seeder.vendorSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


const filterKeys = (vendorObject, event) => {
	vendorObject = vendorObject.toObject();
	for(const key in vendorObject){
		if (eventKeyExposeObject[event].find((keyToExpose) => (keyToExpose == key)) == undefined){
			vendorObject[key] = undefined;
		}
	}
	return vendorObject;
}


const sendEmailOtp = async (vendorEmail) => {
	if(!validator.isEmail(vendorEmail)) {
		throw new Error("Invalid Vendor Email");
	}
	let vendor = await Vendor.findOne({
		email: vendorEmail
	});
	const otpToSend = commonUtils.getOtp();
	vendor.emailOtps.push(otpToSend);
	await vendor.save();
	const mailBody = `Please enter the following OTP: ${otpToSend} to verify your email for your Ambher vendor Account`;
	emailUtils.sendEmail(vendorEmail, "Verify your email ID - Ambher", mailBody);
}


const verifyEmailOtp = async (req) => {
	if(!validator.isEmail(req.body.vendorEmail)) {
		throw new Error("Invalid Vendor Email");
	}
	let vendor = await Vendor.findOne({ 
		email: req.body.vendorEmail
	});
	const otpToVerify = vendor.emailOtps[vendor.emailOtps.length - 1];
	if (otpToVerify === req.body.otp) {
		vendor.isVerified = true;
		await vendor.save();
		return "Vendor Email OTP verified successfully";
	}
	else {
		throw new Error("Wrong Vendor Email OTP");
	}
}


module.exports = {handleLogin, handleLogout, generateDummyVendors, handleGetDetails, sendEmailOtp, verifyEmailOtp};