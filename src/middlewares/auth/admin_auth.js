const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const relativePath = "../..";


//internal imports
const commonUtils = require(`${relativePath}/lib/common_utils`);
const Admin = require(`${relativePath}/models/admin`);
const responseCodes = require(`${relativePath}/lib/constants`).RESPONSE_CODES;


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

    if (!admin) {
      throw new Error ("Admin Auth Error");
    }
    if (admin.configuration.isVerified === false) {
      throw new Error ("Admin account not verified");
    }
    if (admin.configuration.isBlocked === true) {
      throw new Error("Blocked for " + admin.blockedReason);
    }

    req.user = admin;
    req.currentToken = token;
    next();
  } catch (err) {
    const statusCode = responseCodes.UNAUTHORIZED_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
};


module.exports = AdminAuth;
