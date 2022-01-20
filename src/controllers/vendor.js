const mongoose = require("mongoose");
const faker = require("faker");


//Internal Imports
const Vendor = require('../models/vendor');
const commonUtils = require('../lib/common_utils');
const emailUtils = require('../lib/send_email');


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email','profilePictureUrl','dob','address'],
	'toVerify': ['email'],
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
const generateDummyVendors = async (req) => {
	if (req.deleteExisting != true){
		await Vendor.deleteMany({});
		commonUtils.successLog(`All Collection vendor deleted on "${new Date().toString()}" by 'Admin'`);
	}
	let vendorLength = ( (!req.total) ? 10 : req.total);
	for(let i = 0; i < vendorLength; i++) {
		const vendorObject = {
			name: faker.name.firstName(),
			phoneNumber: faker.phone.phoneNumber(),
			email: faker.internet.email() ,
			password: '12345678',
			dob:faker.date.recent(),
			isVerified: true,
			isBlocked: false,
			blockedReason: '',
			address:[
				{
					flatNo:faker.random.alphaNumeric(2),
					buildingNo:faker.random.alphaNumeric(2),
					streetName:faker.address.streetName(),
					city:faker.address.city(),
					state:faker.address.state(),
					country:faker.address.country(),
					zipCode:faker.address.zipCode(),
					lat:faker.address.latitude(),
					lon:faker.address.longitude()
				}
			]
		};
		const vendor = new Vendor(vendorObject);
		await vendor.save();
	}
	return;
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
	let vendor = await Vendor.findOne({ 
		email: req.body.vendorEmail
	});
	const otpToVerify = vendor.emailOtps[vendor.emailOtps.length - 1];
	if (otpToVerify === req.body.otp) {
		vendor.isVerified = true;
		await vendor.save();
		return true;
	}
	else {
		throw new Error("Wrong Vendor Email OTP");
	}
}


module.exports = {handleLogin, handleLogout, generateDummyVendors, handleGetDetails, sendEmailOtp, verifyEmailOtp};