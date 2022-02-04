//Internal Imports
const Customer = require("../models/customer");
const commonUtils = require("../lib/common_utils");
const emailUtils = require("../lib/send_email");
const seeder = require("../../config/database/seeder");


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	"postLogin": ["_id", "name", "email"],
	"toVerify": ["email"],
	"blocked" : ["name","email","blockedReason"],
	"get":["_id", "name", "email", "phoneNumber","profilePictureUrl","dob","address"]
};


const handleSignup = async (reqBody) => {
	const customer = new Customer(reqBody);
	await customer.save();
};


const handleLogin = async (reqBody) => {
	let customerResponse = await Customer.findByCredentials(reqBody.email, reqBody.password);
	if (customerResponse.configuration.isVerified === false) {
		const customerObjectToExpose = commonUtils.filterObjectByAllowedKeys(customerResponse.toObject(), eventKeyExposeObject["toVerify"]);	
		const message = "Customer Email needs to be verified";
		return {customerObjectToExpose, message};
	}
	if (customerResponse.configuration.isBlocked === true) {
		const customerObjectToExpose = commonUtils.filterObjectByAllowedKeys(customerResponse.toObject(), eventKeyExposeObject["blocked"]);	
		const message = "Customer Blocked. Contact Support";
		return {customerObjectToExpose, message};
	}
	const token = await customerResponse.generateToken();
	const customerObjectToExpose = commonUtils.filterObjectByAllowedKeys(customerResponse.toObject(), eventKeyExposeObject["postLogin"]);
	customerObjectToExpose["currentToken"] = token;
	const message = "Customer Login Successful";
	return {customerObjectToExpose, message};
};


const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token !== reqBody.currentToken));
	currentUser.currentToken = "";
	await currentUser.save();
	return;
};


const handleGetDetails = async (customerId) => {
	const customer = await Customer.findById(customerId);
	const customerObjectToExpose = commonUtils.filterObjectByAllowedKeys(customer.toObject(), eventKeyExposeObject["get"]);
	return customerObjectToExpose;
};


//function to generate 10 customer data or on the basis of request
const generateDummyCustomers = async (reqBody) => {
	const verdict = await seeder.customerSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


const sendEmailOtp = async (customerEmail) => {
	let customer = await Customer.findOne({
		email: customerEmail
	});
	if (customer === undefined) {throw new Error("Invalid Customer Email, Customer not found");}
	const otpToSend = commonUtils.getOtp();
	customer.emailOtps.push(otpToSend);
	await customer.save();
	const mailBody = `Please enter the following OTP: ${otpToSend} to verify your email for your Ambher Customer Account`;
	emailUtils.sendEmail(customerEmail, "Verify your email ID - Ambher", mailBody);
};


const verifyEmailOtp = async (reqBody) => {
	let customer = await Customer.findOne({ 
		email: reqBody.customerEmail
	});
	if (customer === undefined) {throw new Error("Invalid Customer Email, Customer not found");}
	const otpToVerify = customer.emailOtps[customer.emailOtps.length - 1];
	if (otpToVerify === reqBody.otp) {
		customer.configuration.isVerified = true;
		await customer.save();
		return "Customer OTP verified successfully";
	}
	else {
		throw new Error("Wrong Customer Email OTP");
	}
};


module.exports = {handleLogin, handleLogout, generateDummyCustomers, handleGetDetails,
sendEmailOtp, verifyEmailOtp, handleSignup};