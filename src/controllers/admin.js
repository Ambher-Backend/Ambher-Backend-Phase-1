const mongoose = require("mongoose");
const faker = require("faker");


// Internal Imports
const Admin = require("../models/admin");
const commonUtils = require('../lib/common_utils')

// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email'],
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
	const token = await adminResponse.generateToken();
	const adminObjectToExpose = filterKeys(adminResponse, 'postLogin');
	adminObjectToExpose['token'] = token;
	return adminObjectToExpose;
};


const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token != reqBody.currentToken));
	currentUser.token = '';
	await currentUser.save();
	return;
};

const handleGetDetails = async (adminId) => {
	const admin = await Admin.findById(adminId);
	const adminObjectToExpose = filterKeys(admin, 'get');
	return adminObjectToExpose;
}


const filterKeys = (adminObject, event) => {
	adminObject = adminObject.toObject();
	for(const key in adminObject){
		if (eventKeyExposeObject[event].find((keyToExpose) => (keyToExpose == key)) == undefined){
			adminObject[key] = undefined;
		}
	}
	return adminObject;
}



module.exports = {generateDummyAdmins, handleLogin, handleLogout, handleGetDetails};