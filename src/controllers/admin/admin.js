// Internal Imports
const Admin = require("../../models/admin");
const commonUtils = require("../../lib/common_utils");
const emailUtils = require("../../lib/send_email");
const seeder = require("../../../config/database/seeder");
const {prepareOrderforAdminView} = require("../../services/fetch_filtered_orders");
const responseCodes = require("../../lib/constants").RESPONSE_CODES;


// If any other key is to be exposed to frontend, then this can be added in this event based key expose.
const eventKeyExposeObject = {
  "postLogin": ["_id", "name", "email"],
  "toVerify": ["email"],
  "blocked": ["name", "email", "blockedReason"],
  "get": ["_id", "name", "email", "phoneNumber"],
};


//
//**************************General Endpoint Controllers/Helpers*******************************
//
const handleSignup = async (reqBody) => {
  const admin = new Admin(reqBody);
  await admin.save();
};


const handleLogin = async (reqBody) => {
  let adminResponse = await Admin.findByCredentials(reqBody.email, reqBody.password);
  if (adminResponse === "Password Incorrect") {
    const adminObjectToExpose = null;
    const message = adminResponse;
    return {adminObjectToExpose, message};
  }
  if (adminResponse.configuration.isVerified === false) {
    const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject["toVerify"]);
    const message = "Admin Email needs to be verified";
    return {adminObjectToExpose, message};
  }
  if (adminResponse.configuration.isBlocked === true) {
    const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject["blocked"]);
    const message = "Admin Blocked. Contact Support";
    return {adminObjectToExpose, message};
  }
  const token = await adminResponse.generateToken();
  const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(adminResponse.toObject(), eventKeyExposeObject["postLogin"]);
  adminObjectToExpose["currentToken"] = token;
  const message = "Admin Login Successful";
  return {adminObjectToExpose, message};
};


const handleGetDetails = async (adminId, reqUser) => {
  if (adminId !== reqUser._id.toString()) {
    throw commonUtils.generateError(responseCodes.ACCESS_ERROR_CODE, "Invalid Access");
  }
  const admin = await Admin.findById(adminId);
  const adminObjectToExpose = commonUtils.filterObjectByAllowedKeys(admin.toObject(), eventKeyExposeObject["get"]);
  return adminObjectToExpose;
};


const handleLogout = async (reqBody, currentUser) => {
  currentUser.tokens = currentUser.tokens.filter((token) => (token !== reqBody.currentToken));
  currentUser.currentToken = "";
  await currentUser.save();
  return;
};


//function to generate 5 admin data or on the basis of request
const generateDummyAdmins = async (reqBody) => {
  const verdict = await seeder.adminSeeder(reqBody.deleteExisting, reqBody.total);
  return verdict;
};


const sendEmailOtp = async (adminEmail) => {
  let admin = await Admin.findOne({
    email: adminEmail
  });
  if (!admin) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Invalid Email, Admin Not registered");
  }
  const otpToSend = commonUtils.getOtp();
  admin.emailOtps.push(otpToSend);
  await admin.save();
  const mailBody = `Please enter the following OTP: ${otpToSend} to verify your email for your Ambher admin Account`;
  emailUtils.sendEmail(adminEmail, "Verify your email ID - Ambher", mailBody);
};


const verifyEmailOtp = async (reqBody) => {
  let admin = await Admin.findOne({
    email: reqBody.adminEmail
  });
  if (!admin) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Invalid Email, Admin Not registered");
  }
  const otpToVerify = admin.emailOtps[admin.emailOtps.length - 1];
  if (otpToVerify === reqBody.otp) {
    admin.configuration.isVerified = true;
    await admin.save();
    return "Admin Email OTP verified successfully";
  }
  else {
    return "Wrong Admin Email OTP";
  }
};


const listOrder = async (orderId) => {
  const filteredOrdersList = await prepareOrderforAdminView({orderId: orderId});
  return filteredOrdersList;
};


module.exports = {generateDummyAdmins, handleSignup, handleLogin, handleLogout,
  handleGetDetails, sendEmailOtp, verifyEmailOtp, listOrder};
