const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


//internal imports
const commonUtils = require("../../lib/common_utils");
const Admin = require("../../models/admin");


const AdminAuth = async (req, res, next) => {
	try {
		const token = req.body.currentToken;
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		const admin = await Admin.findOne({
			_id: decoded._id,
			tokens: {
				"$in": [token]
			}
		});

		if(!admin) {
			throw new Error ("Admin Auth Error");
		}
		if(admin.configuration.isVerified === false) {
			throw new Error ("Admin account not verified");
		}
		if(admin.configuration.isBlocked === true) {
			throw new Error("Blocked for " + admin.blockedReason);
		}

		req.user = admin;
		req.currentToken = token;
		next();
	} catch (err) {
		commonUtils.errorLog(err.message);
		res.send(commonUtils.responseUtil(401, null, err.message));
	}
};

module.exports = AdminAuth;
