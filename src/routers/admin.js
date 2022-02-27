const express = require("express");

// Router Config
const router = new express.Router();


//internal imports
const baseHelper = require("../controllers/admin/base");
const commonUtils = require("../lib/common_utils");
const baseParamValidator = require("../middlewares/param_validators/admin/base");
const adminAuth = require("../middlewares/auth/admin_auth");
const responseCodes = require("../lib/constants").RESPONSE_CODES;


const {adminHelper, vendorHelper, customerHelper, productHelper} = baseHelper;
const {adminParamValidator, vendorParamValidator, customerParamValidator, productParamValidator} = baseParamValidator;


//
//**************************General Endpoints*******************************
//
//signup route
router.post("/signup", adminParamValidator.signUpParamValidation, async (req, res)=>{
  try {
    await adminHelper.handleSignup(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, "Admin Created"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//login route
router.post("/login", adminParamValidator.loginAdminParamValidation, async (req, res) => {
  try {
    const adminLoginResponse = await adminHelper.handleLogin(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, adminLoginResponse.adminObjectToExpose, adminLoginResponse.message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//get route for admin details
router.get("/:adminId", adminParamValidator.getAdminParamValidation, adminAuth, async (req, res) => {
  try {
    const adminResponse = await adminHelper.handleGetDetails(req.params.adminId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, adminResponse, "Success"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//logout route
router.post("/logout", adminParamValidator.logoutAdminParamValidation, adminAuth, async (req, res) => {
  try {
    await adminHelper.handleLogout(req.body, req.user);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Admin Logged out"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//generate dummy data route
router.post("/create-dummy-data", adminParamValidator.generateAdminDummyDataValidation, async (req, res) => {
  try {
    const message = await adminHelper.generateDummyAdmins(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//send a new otp to admin email
router.post("/new-email-otp", adminParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await adminHelper.sendEmailOtp(req.body.adminEmail);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Admin Email OTP sent successfully"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify the email otp of admin
router.post("/verify-email-otp", adminParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await adminHelper.verifyEmailOtp(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifiedEmailOtpMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//
//**************************Admin Vendor Routes*******************************
//
//view vendor list based on filters
router.post("/vendors", vendorParamValidator.listVendorsValidation, adminAuth, async (req, res) => {
  try {
    const filteredVendors = await vendorHelper.listVendors(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, filteredVendors, "Vendor List"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//view individual vendor details
router.get("/vendor-details/:vendorId", vendorParamValidator.viewVendorDetailsValidation, adminAuth, async (req, res) => {
  try {
    const vendorDetailsResponse = await vendorHelper.vendorDetails(req.params.vendorId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, vendorDetailsResponse, "Vendor Details"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify vendor account
router.post("/verify-vendor", vendorParamValidator.verifyVendorAccountValidation, adminAuth, async (req, res) => {
  try {
    const verifyVendorAccountMessage = await vendorHelper.verifyVendor(req.user, req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifyVendorAccountMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//
//**************************Admin Customer Routes*******************************
//
//view customer list based on filters
router.post("/customers", customerParamValidator.listCustomersValidation, adminAuth, async (req, res) => {
  try {
    const filteredCustomers = await customerHelper.listCustomers(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, filteredCustomers, "Customer List"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//view individual customer details
router.get("/customer-details/:customerId", customerParamValidator.viewCustomerDetailsValidation, adminAuth, async (req, res) => {
  try {
    const customerDetailsResponse = await customerHelper.customerDetails(req.params.customerId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customerDetailsResponse, "Customer Details"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});

router.get("/customer-detail/:customerEmail", customerParamValidator.customerSearchValidation, adminAuth, async (req, res) => {
  try {
    const customer = await customerHelper.customerSearch(req.params.customerEmail);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customer, "Customer fetched"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});

//
//**************************Admin Products Routes*******************************
//
//view product list based on filters
router.post("/products", productParamValidator.listProductsValidation, adminAuth, async (req, res) => {
  try {
    const filteredProducts = await productHelper.listProducts(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, filteredProducts, "Product List"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//view individual product details
router.get("/product-details/:productId", productParamValidator.viewProductDetailsValidation, adminAuth, async (req, res) => {
  try {
    const productDetailsResponse = await productHelper.productDetails(req.params.productId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, productDetailsResponse, "Product Details"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify product
router.post("/verify-product", productParamValidator.verifyProductValidation, adminAuth, async (req, res) => {
  try {
    const verifyProductMessage = await productHelper.verifyProduct(req.user, req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifyProductMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//block product
router.post("/block-product", productParamValidator.blockProductValidation, adminAuth, async (req, res) => {
  try {
    const blockProductMessage = await productHelper.blockProduct(req.user, req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, blockProductMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});



module.exports = router;
