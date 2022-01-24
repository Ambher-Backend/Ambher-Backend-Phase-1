const validator = require("validator");


//Internal Imports
const Customer = require('../models/customer');
const commonUtils = require('../lib/common_utils');
const emailUtils = require('../lib/send_email');
const seeder = require('../../config/database/seeder');


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email'],
	'toVerify': ['email'],
	'blocked' : ['name','email','blockedReason'],
	'get':['_id', 'name', 'email', 'phoneNumber','profilePictureUrl','dob','address']
};


const handleLogin = async (reqBody) => {
	let customerResponse = await Customer.findByCredentials(reqBody.email, reqBody.password);
	if (customerResponse.isVerified === false) {
		const customerObjectToExpose = filterKeys(customerResponse, 'toVerify');	
		const message = "Customer Email needs to be verified";
		return {customerObjectToExpose, message};
	}
	if (customerResponse.isBlocked === true) {
		const customerObjectToExpose = filterKeys(customerResponse, 'blocked');	
		const message = "Customer Blocked. Contact Support";
		return {customerObjectToExpose, message};
	}
	const token = await customerResponse.generateToken();
	const customerObjectToExpose = filterKeys(customerResponse, 'postLogin');
	customerObjectToExpose['token'] = token;
	const message = "Customer Login Successful";
	return {customerObjectToExpose, message};
};


const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token != reqBody.currentToken));
	currentUser.currentToken = '';
	await currentUser.save();
	return;
};


const handleGetDetails = async (customerId) => {
	const customer = await Customer.findById(customerId);
	const customerObjectToExpose = filterKeys(customer, 'get');
	return customerObjectToExpose;
};


const filterKeys = (customerObject, event) => {
	customerObject = customerObject.toObject();
	for(const key in customerObject){
		if (eventKeyExposeObject[event].find((keyToExpose) => (keyToExpose == key)) == undefined){
			customerObject[key] = undefined;
		}
	}
	return customerObject;
}


//function to generate 10 customer data or on the basis of request
const generateDummyCustomers = async (reqBody) => {
	const verdict = await seeder.customerSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


const sendEmailOtp = async (customerEmail) => {
	if(!validator.isEmail(customerEmail)) {
		throw new Error("Invalid Customer Email");
	}
	let customer = await Customer.findOne({
		email: customerEmail
	});
	const otpToSend = commonUtils.getOtp();
	customer.emailOtps.push(otpToSend);
	await customer.save();
	const mailBody = `Please enter the following OTP: ${otpToSend} to verify your email for your Ambher Customer Account`;
	emailUtils.sendEmail(customerEmail, "Verify your email ID - Ambher", mailBody);
}


const verifyEmailOtp = async (req) => {
	if(!validator.isEmail(req.body.customerEmail)) {
		throw new Error("Invalid Customer Email");
	}
	let customer = await Customer.findOne({ 
		email: req.body.customerEmail
	});
	const otpToVerify = customer.emailOtps[customer.emailOtps.length - 1];
	if (otpToVerify === req.body.otp) {
		customer.isVerified = true;
		await customer.save();
		return "Customer OTP verified successfully";
	}
	else {
		throw new Error("Wrong Customer Email OTP");
	}
}


module.exports = {handleLogin, handleLogout, generateDummyCustomers, handleGetDetails, sendEmailOtp, verifyEmailOtp};