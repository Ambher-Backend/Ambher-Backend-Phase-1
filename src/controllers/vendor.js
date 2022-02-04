//Internal Imports
const Vendor = require("../models/vendor");
const commonUtils = require("../lib/common_utils");
const emailUtils = require("../lib/send_email");
const seeder = require("../../config/database/seeder");


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	"postLogin": ["_id", "name", "email","profilePictureUrl","dob","address"],
	"toVerify": ["email"],
	"blocked" : ["name","email","blockedReason"],
	"get":["_id", "name", "email", "phoneNumber","profilePictureUrl","dob","address"]
};


const handleSignup = async (reqBody) => {
	const vendor = new Vendor(reqBody);
	await vendor.save();
};


const handleLogin = async (reqBody) => {
	let vendorResponse = await Vendor.findByCredentials(reqBody.email, reqBody.password);
	if (vendorResponse.configuration.isVerified === false) {
		const vendorObjectToExpose = commonUtils.filterObjectByAllowedKeys(vendorResponse.toObject, eventKeyExposeObject["toVerify"]);	
		vendorObjectToExpose.productModify = false;
		const message = "Vendor Email needs to be verified";
		return {vendorObjectToExpose, message};
	}
	if (vendorResponse.configuration.isBlocked === true) {
		const vendorObjectToExpose = commonUtils.filterObjectByAllowedKeys(vendorResponse.toObject, eventKeyExposeObject["blocked"]);	
		vendorObjectToExpose.productModify = false;
		const message = "Vendor Blocked. Contact Support";
		return {vendorObjectToExpose, message};
	}
	if (vendorResponse.configuration.isVerifiedByAdmin === false) {
		const vendorObjectToExpose = commonUtils.filterObjectByAllowedKeys(vendorResponse.toObject, eventKeyExposeObject["postLogin"]);
		vendorObjectToExpose.productModify = false;
		const message = "Vendor Unverified by admin";
		return {vendorObjectToExpose, message};
	}
	const token = await vendorResponse.generateToken();
	const vendorObjectToExpose = commonUtils.filterObjectByAllowedKeys(vendorResponse.toObject, eventKeyExposeObject["postLogin"]);
	vendorObjectToExpose.productModify = true;
	vendorObjectToExpose["currentToken"] = token;
	const message = "Vendor Login Successful";
	return {vendorObjectToExpose, message};
};


const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token !== reqBody.currentToken));
	currentUser.currentToken = "";
	await currentUser.save();
	return;
};


const handleGetDetails = async (vendorId) => {
	const vendor = await Vendor.findById(vendorId);
	const vendorObjectToExpose = commonUtils.filterObjectByAllowedKeys(vendor.toObject(), eventKeyExposeObject["get"]);
	return vendorObjectToExpose;
};


//function to generate 10 vendor data or on the basis of request
const generateDummyVendors = async (reqBody) => {
	const verdict = await seeder.vendorSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


const sendEmailOtp = async (vendorEmail) => {
	let vendor = await Vendor.findOne({
		email: vendorEmail
	});
	if (vendor === undefined) {throw new Error("Invalid email, Vendor Not Found");}
	const otpToSend = commonUtils.getOtp();
	vendor.emailOtps.push(otpToSend);
	await vendor.save();
	const mailBody = `Please enter the following OTP: ${otpToSend} to verify your email for your Ambher vendor Account`;
	emailUtils.sendEmail(vendorEmail, "Verify your email ID - Ambher", mailBody);
};


const verifyEmailOtp = async (req) => {
	let vendor = await Vendor.findOne({ 
		email: req.body.vendorEmail
	});
	if (vendor === undefined) {throw new Error("Invalid email, Vendor Not Found");}
	const otpToVerify = vendor.emailOtps[vendor.emailOtps.length - 1];
	if (otpToVerify === req.body.otp) {
		vendor.configuration.isVerified = true;
		await vendor.save();
		return "Vendor Email OTP verified successfully";
	}
	else {
		throw new Error("Wrong Vendor Email OTP");
	}
};


module.exports = {handleSignup, handleLogin, handleLogout, generateDummyVendors, handleGetDetails, sendEmailOtp, verifyEmailOtp};
