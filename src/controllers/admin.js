// Internal Imports
const Admin = require("../models/admin");
const Vendor = require("../models/vendor");
const commonUtils = require('../lib/common_utils');
const emailUtils = require('../lib/send_email');
const seeder = require('../../config/database/seeder');
const fetchFilteredVendors = require('../services/fetch_filtered_vendors');


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email'],
	'toVerify': ['email'],
	'blocked' : ['name','email','blockedReason'],
	'get':['_id', 'name', 'email', 'phoneNumber'],
};


//function to generate 5 admin data or on the basis of request
const generateDummyAdmins = async (reqBody) => {
	const verdict = await seeder.adminSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


const handleSignup = async (reqBody) => {
	const admin = new Admin(reqBody);
	await admin.save();
}


const handleLogin = async (reqBody) => {
	let adminResponse = await Admin.findByCredentials(reqBody.email, reqBody.password);
	if (adminResponse.configuration.isVerified === false) {
		const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject['toVerify']);	
		const message = "Admin Email needs to be verified";
		return {adminObjectToExpose, message};
	}
	if (adminResponse.configuration.isBlocked === true) {
		const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject['blocked']);	
		const message = `Admin Blocked. Contact Support`;
		return {adminObjectToExpose, message};
	}
	const token = await adminResponse.generateToken();
	const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject['postLogin']);
	adminObjectToExpose['currentToken'] = token;
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
		admin.configuration.isVerified = true;
		await admin.save();
		return "Admin Email OTP verified successfully";
	}
	else {
		throw new Error("Wrong Admin Email OTP");
	}
}


const verifyVendor = async (admin, reqBody) => {
	let vendor = await Vendor.findById(reqBody.vendorId);
	if (vendor == undefined){throw new Error('Invalid vendor ID');}
	if (vendor.configuration.isVerified === false){throw new Error('Vendor needs to verify their email');}
	vendor.configuration.isVerifiedByAdmin = true;
	vendor.verifiedBy = admin._id;
	await vendor.save();
	const mailBody = `Congratulations, ${vendor.name}! Your Ambher Vendor Account has been verified.`;
	emailUtils.sendEmail(vendor.email, "Ambher Vendor Account Verified", mailBody);
	return "Vendor Account Verified By Admin Successfully";
}


const listVendors = async (reqBody) => {
	const filteredVendors = await fetchFilteredVendors.filter(reqBody.filter);
	let filteredVendorsResponse = [] 
	for(let vendor of filteredVendors){
		const vendorResponse = {
			profilePictureUrl: vendor.profilePictureUrl,
			name: vendor.name,
			phoneNumber: vendor.phoneNumber,
			email: vendor.email,
			address: Object.values(vendor.address).join(', '),
			reviews: vendor.reviews.length,
			rating: vendor.rating,
			totalOrders: vendor.customerOrderIds.length,
			totalProducts: vendor.productIds.length
		}
		filteredVendorsResponse.push(vendorResponse)
	}
	return commonUtils.paginate(filteredVendorsResponse);
}


module.exports = {generateDummyAdmins, handleSignup, handleLogin, handleLogout, handleGetDetails,
sendEmailOtp, verifyEmailOtp, verifyVendor, listVendors};