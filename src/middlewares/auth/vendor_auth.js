const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//internal imports
const Vendor = require("../../models/vendor");
const commonUtils = require("../../lib/common_utils");
dotenv.config();

//Vendor Authorization middleware function
const VendorAuth = async (req, res, next) => {
  try {
    if (!req.body.currentToken){
      throw new Error("Token not present");
    }
    const token = req.body.currentToken;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const vendor = await Vendor.findOne({
      _id: decoded._id,
      tokens: {
        "$in": [token]
      }
    });
    if (!vendor) {
      throw new Error ("Vendor is not authorised");
    }
    if (vendor.configuration.isVerified === false) {
      throw new Error ("Vendor account not verified");
    }
    if (vendor.configuration.isBlocked === true) {
      throw new Error("Blocked for " + vendor.blockedReason);
    }
    req.user = vendor;
    req.currentToken = token;
    next();
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(401, null, err.message));
  }
};

module.exports = VendorAuth;
