const express = require('express');
const config = require('config');
const dotenv = require('dotenv');
const validator = require('validator')

// Router Config
const router = new express.Router();
dotenv.config();

//internal imports
const Admin = require('../models/admin');
const helper = require('../controllers/admin');
const commonUtils = require('../lib/common_utils');

//signup route
router.post('/signup', async (req, res)=>{
	try {
		if(req.body.password.length<8) {
			throw new Error('Weak Password');
		}
		if(req.body.phoneNumber.length != 10 || req.body.phoneNumber.match(/[0-9]{10}/)[0] != req.body.phoneNumber) {
			throw new Error('Invalid Phone Number');
		}
		if(!validator.isEmail(req.body.email)) {
			throw new Error('Invalid Mail');
		}
		const admin = new Admin(req.body);
		await admin.save();
		res.send(commonUtils.responseUtil(201, null, "Admin Created"));

	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});

//login route
router.post('/login',async (req, res) => {
	try {
		let adminResponse = await Admin.findByCredentials(req.body.email, req.body.password);
		const token = adminResponse.generateToken();
		delete adminResponse.password;
		res.send(commonUtils.responseUtil(200, adminResponse, "Admin Login Successful"));
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});

//logout route
router.post('/logout', async (req, res) => {
	try{
		let adminResponse = await Admin.findOne({'_id': mongoose.Types.ObjectId(req.admin._id)});
		adminResponse.currentToken = '';
		await adminResponse.save();
		res.send(commonUtils.responseUtil(200, null, "Admin Logged out"));
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
		if (req.body.internalAuthKey != process.env.JWT_KEY){
			throw new Error('Un-authorized access');
		}
		await helper.generateDummyAdmins(req.body);
		res.send(commonUtils.responseUtil(201, null, 'Data Created'));
	} catch(err) {
		console.log(err);
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});

module.exports = router;