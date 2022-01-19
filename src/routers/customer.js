const express = require('express');
const config = require('config');
const dotenv = require('dotenv');
const validator = require('validator');
const mongoose = require('mongoose');


// Router Config
const router = new express.Router();
dotenv.config();

//internal imports
const Customer = require('../models/customer');
const commonUtils = require('../lib/common_utils');
const helper = require('../controllers/customer');
const CustomerAuth = require('../middlewares/customer_auth');
//signup route
router.post('/signup',async (req, res) => {

    try {
        if (req.body.password.length < 8) {
            throw new Error('Weak Password');
        }
        if (req.body.phoneNumber.length != 10 || req.body.phoneNumber.match(/[0-9]{10}/)[0] != req.body.phoneNumber) {
            throw new Error('Invalid Phone Number');
        }
        if (!validator.isEmail(req.body.email)) {
            throw new Error('Invalid Mail');
        }
        const customer = new Customer(req.body);
		await customer.save();
        res.send(commonUtils.responseUtil(201, null, "Customer Created"));
        

    } catch (err) {
        commonUtils.errorLog(err.message);
        res.send(commonUtils.responseUtil(400, null, err.message));
    }
});

//login route
router.post('/login',async (req, res) => {
	try {
		const customerResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, customerResponse, "Customer Login Successful"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});

//logout route
router.post('/logout', CustomerAuth, async (req, res) => {
	try{
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Customer Logged out"));
	} catch(err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});



//generate dummy data route
router.post('/create-dummy-data', async (req, res) => {
	try {
		if (config.util.getEnv('NODE_ENV') == 'production'){
			throw new Error('Dummy Data Creation Not Allowed on Production Server');
		}
		if (req.body.internalAuthKey === undefined || req.body.internalAuthKey !== process.env.INTERNAL_AUTH_ID){
			throw new Error(`Un-authorized access`);
		}
		await helper.generateDummyCustomers(req.body);
		res.send(commonUtils.responseUtil(201, null, 'Data Created'));
	} catch(err) {
		console.log(err);
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});

//get route for Customer details
router.get('/:customerId',CustomerAuth, async (req, res) => {
	try{
		if (req.params.customerId === undefined){
			throw new Error('Id not found');
		}
		const customerResponse = await helper.handleGetDetails(req.params.customerId);
		res.send(commonUtils.responseUtil(200, customerResponse, "Success"));
	}catch(err){
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
})

module.exports = router;