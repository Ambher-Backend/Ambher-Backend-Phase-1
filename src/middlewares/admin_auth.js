const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const utils = require('../lib/common_uitls');
const dotenv = require('dotenv');

dotenv.config();

const AdminAuth = async (req, res, next) => {
    try {
        if (!req.body.token){
            throw new Error("Token not present");
        }
        if(req.body.isVerified === false) {
            throw new Error ("Admin account not verified");
        }
        if(req.body.isBlocked === true) {
            throw new Error("Blocked for "+req.body.BlockedReason);
        }
        const token = req.body.currentToken;
        const decoded = jwt.verify(token,process.env.INTERNAL_AUTH_ID);
        const admin = await Admin.findOne({
            _id: decoded._id,
            currentToken: token
        });
        if(!admin) {
            throw new Error ("Admin Auth Error");
        }
        req.admin = admin;
        req.token = token;
        next();
    }
    catch (err) {
        res.send(utils.responseUtil(401,err.message,null));
    }
};

module.exports = AdminAuth;