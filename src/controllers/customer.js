const mongoose = require("mongoose");
const faker = require("faker");
//Internal Imports
const Customer = require('../models/customer');
const commonUtils = require('../lib/common_utils')

// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
	'postLogin': ['_id', 'name', 'email'],
	'get':['_id', 'name', 'email', 'phoneNumber']
};
const handleLogin = async (reqBody) => {
	let customerResponse = await Customer.findByCredentials(reqBody.email, reqBody.password);
	const token = await customerResponse.generateToken();
	const customerObjectToExpose = filterKeys(customerResponse, 'postLogin');
	customerObjectToExpose['token'] = token;
	console.log(customerObjectToExpose);
	return customerObjectToExpose;
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
}

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
const generateDummyCustomers = async (req) => {
	console.log(req.deleteExisting === true);
	if (req.deleteExisting != true){
		console.log(req.deleteExisting)
		await Customer.deleteMany({});
		commonUtils.successLog(`All Collection admin deleted on "${new Date().toString()}" by 'Admin'`);
	}
	let customerLength = ( (!req.total) ? 5 : req.total);
	for(let i = 0; i < customerLength; i++) {
		const customerObject = {
			name: faker.name.firstName(),
			phoneNumber: faker.phone.phoneNumber(),
			email: faker.internet.email() ,
			password: '12345678',
			dob:faker.date.recent(),
			isVerified: true,
			isBlocked: false,
			blockedReason: ''
		};
		const customer = new Customer(customerObject);
		await customer.save();
	}
	return;
};
module.exports={handleLogin,filterKeys,handleLogout,generateDummyCustomers,handleGetDetails};