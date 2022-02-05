const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


//internal imports
const commonUtils = require("../../lib/common_utils");
const Customer = require("../../models/customer");


const CustomerAuth = async (req, res, next) => {
  try {
    if (!(req.body.currentToken)){
      throw new Error("Token not present");
    }
    const token = req.body.currentToken;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const customer = await Customer.findOne({
      _id: decoded._id,
      tokens: {
        "$in": [token]
      }
    });

    if (!customer) {
      throw new Error ("Customer Auth Error");
    }
    if (customer.isVerified === false) {
      throw new Error ("Customer account not verified");
    }
    if (customer.isBlocked === true) {
      throw new Error("Blocked for " + customer.blockedReason);
    }

    req.user = customer;
    req.currentToken = token;
    next();
  } catch (err) {
    res.send(commonUtils.responseUtil(401, null, err.message));
  }
};


module.exports = CustomerAuth;
