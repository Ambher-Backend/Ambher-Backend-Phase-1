const mongoose = require("mongoose");

//Internal Imports
const Customer = require('../models/customer');

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
	return customerObjectToExpose;
};
const handleLogout = async (reqBody, currentUser) => {
	currentUser.tokens = currentUser.tokens.filter((token) => (token != reqBody.currentToken));
	currentUser.currentToken = '';
	await currentUser.save();
	return;
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

module.exports={handleLogin,filterKeys,handleLogout};