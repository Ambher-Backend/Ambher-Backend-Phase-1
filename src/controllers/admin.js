const mongoose = require("mongoose");
const faker = require("faker");
const validator = require("validator");


// Internal Imports
const Admin = require("../models/admin");
const commonUtils = require('../lib/common_utils')
const emailUtils = require('../lib/send_email')

// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email'],
	'toVerify': ['email'],
	'blocked' : ['name','email','blockedReason'],
	'get':['_id', 'name', 'email', 'phoneNumber']
};


//function to generate 5 admin data or on the basis of request
const generateDummyAdmins = async (req) => {
	if (req.deleteExisting === true){
		await Admin.deleteMany({});
		commonUtils.successLog(`All Collection admin deleted on "${new Date().toString()}" by 'Admin'`);
	}
	let adminLength = ( (!req.total) ? 5 : req.total);
	for(let i = 0; i < adminLength; i++) {
		const adminObject = {
			name: faker.name.firstName(),
			phoneNumber: faker.phone.phoneNumber(),
			email: faker.internet.email() ,
			password: '12345678',
			isVerified: true,
			isBlocked: false,
			blockedReason: ''
		};
		const admin = new Admin(adminObject);
		await admin.save();
	}
	return;
};


const handleLogin = async (reqBody) => {
	let adminResponse = await Admin.findByCredentials(reqBody.email, reqBody.password);
	if (adminResponse.isVerified === false) {
		const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject['toVerify']);	
		const message = "Admin Email needs to be verified";
		return {adminObjectToExpose, message};
	}
	if (adminResponse.isBlocked === true) {
		const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject['blocked']);	
		const message = `Admin Blocked. Contact Support`;
		return {adminObjectToExpose, message};
	}
	const token = await adminResponse.generateToken();
	const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject['postLogin']);
	adminObjectToExpose['token'] = token;
	const message = "Admin Login Successful";
	return {adminObjectToExpose, message};
};


const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token != reqBody.currentToken));
	currentUser.currentToken = '';
	await currentUser.save();
	return;
};


const handleGetDetails = async (adminId) => {
	const admin = await Admin.findById(adminId);
	const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(admin.toObject(), eventKeyExposeObject['get']);
	return adminObjectToExpose;
}


const sendEmailOtp = async (adminEmail) => {
	let admin = await Admin.findOne({
		email: adminEmail
	});
	if (admin == undefined){throw new Error('Invalid Email, Admin Not registered');}
	const otpToSend = commonUtils.getOtp();
	admin.emailOtps.push(otpToSend);
	await admin.save();
	const mailBody = `Please enter the following OTP: ${otpToSend} to verify your email for your Ambher admin Account`;
	emailUtils.sendEmail(adminEmail, "Verify your email ID - Ambher", mailBody);
}


const verifyEmailOtp = async (reqBody) => {
	let admin = await Admin.findOne({ 
		email: reqBody.adminEmail
	});
	if (admin == undefined){throw new Error('Invalid Email, Admin Not registered');}
	const otpToVerify = admin.emailOtps[admin.emailOtps.length - 1];
	if (otpToVerify === reqBody.otp) {
		admin.isVerified = true;
		await admin.save();
		return "Admin Email OTP verified successfully";
	}
	else {
		throw new Error("Wrong Admin Email OTP");
	}
}


module.exports = {generateDummyAdmins, handleLogin, handleLogout, handleGetDetails, sendEmailOtp, verifyEmailOtp};