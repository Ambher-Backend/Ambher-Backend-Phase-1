const mongoose = require("mongoose");
const faker = require("faker");

// Internal Imports
const Admin = require("../models/admin");
const commonUtils = require('../lib/common_utils')

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


module.exports = {generateDummyAdmins};