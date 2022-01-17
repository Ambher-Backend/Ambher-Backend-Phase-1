const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//internal imports
const commonUtils = require('../lib/common_utils');
const Admin = require('../models/admin');

dotenv.config();

const AdminAuth = async (req, res, next) => {
	try {
		if (!req.body.currentToken){
			throw new Error("Token not present");
		}  
		const token = req.body.currentToken;
		const decoded = jwt.verify(token,process.env.JWT_KEY);
		const admin = await Admin.findOne({
			_id: decoded._id,
			currentToken: token
		});
		if(!admin) {
			throw new Error ("Admin Auth Error");
		}
		if(admin.isVerified === false) {
			throw new Error ("Admin account not verified");
		}
		if(admin.isBlocked === true) {
			throw new Error("Blocked for " + admin.blockedReason);
		}
		req.user = admin;
		req.currentToken = token;
		next();
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(401,null,err.message));
	}
};

module.exports = AdminAuth;