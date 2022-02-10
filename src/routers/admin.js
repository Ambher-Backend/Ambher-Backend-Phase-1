const express = require("express");

// Router Config
const router = new express.Router();

const relativePath = "..";

//internal imports
const helperAdmin = require(`${relativePath}/controllers/admin/admin`);
const helperVendor = require(`${relativePath}/controllers/admin/admin_vendor`);
const helperCustomer = require(`${relativePath}/controllers/admin/admin_customer`);
const helperProduct = require(`${relativePath}/controllers/admin/admin_product`);
const commonUtils = require(`${relativePath}/lib/common_utils`);
const adminParamValidator = require(`${relativePath}/middlewares/param_validators/admin/admin`);
const adminVendorParamValidator = require(`${relativePath}/middlewares/param_validators/admin/admin_vendor`);
const adminCustomerParamValidator = require(`${relativePath}/middlewares/param_validators/admin/admin_customer`);
const adminProductParamValidator = require(`${relativePath}/middlewares/param_validators/admin/admin_product`);
const AdminAuth = require(`${relativePath}/middlewares/auth/admin_auth`);
const responseCodes = require(`${relativePath}/lib/constants`).RESPONSE_CODES;


//
//**************************General Endpoints*******************************
//
//signup route
router.post("/signup", adminParamValidator.signUpParamValidation, async (req, res)=>{
  try {
    await helperAdmin.handleSignup(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, "Admin Created"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//login route
router.post("/login", adminParamValidator.loginAdminParamValidation, async (req, res) => {
  try {
    const adminLoginResponse = await helperAdmin.handleLogin(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, adminLoginResponse.adminObjectToExpose, adminLoginResponse.message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//get route for admin details
router.get("/:adminId", adminParamValidator.getAdminParamValidation, AdminAuth, async (req, res) => {
  try {
    const adminResponse = await helperAdmin.handleGetDetails(req.params.adminId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, adminResponse, "Success"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//logout route
router.post("/logout", adminParamValidator.logoutAdminParamValidation, AdminAuth, async (req, res) => {
  try {
    await helperAdmin.handleLogout(req.body, req.user);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Admin Logged out"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//generate dummy data route
router.post("/create-dummy-data", adminParamValidator.generateAdminDummyDataValidation, async (req, res) => {
  try {
    const message = await helperAdmin.generateDummyAdmins(req.body);
    res.status(responseCodes.CREATED_CODE).send(commonUtils.responseUtil(responseCodes.CREATED_CODE, null, message));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//send a new otp to admin email
router.post("/new-email-otp", adminParamValidator.sendEmailOtpValidation, async (req, res) => {
  try {
    await helperAdmin.sendEmailOtp(req.body.adminEmail);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Admin Email OTP sent successfully"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify the email otp of admin
router.post("/verify-email-otp", adminParamValidator.verifyEmailOtpValidation, async (req, res) => {
  try {
    const verifiedEmailOtpMessage = await helperAdmin.verifyEmailOtp(req.body);
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
router.post("/vendors", adminVendorParamValidator.listVendorsValidation, AdminAuth, async (req, res) => {
  try {
    const filteredVendors = await helperVendor.listVendors(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, filteredVendors, "Vendor List"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//view individual vendor details
router.get("/vendor-details/:vendorId", adminVendorParamValidator.viewVendorDetailsValidation, AdminAuth, async (req, res) => {
  try {
    const vendorDetailsResponse = await helperVendor.vendorDetails(req.params.vendorId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, vendorDetailsResponse, "Vendor Details"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify vendor account
router.post("/verify-vendor", adminVendorParamValidator.verifyVendorAccountValidation, AdminAuth, async (req, res) => {
  try {
    const verifyVendorAccountMessage = await helperVendor.verifyVendor(req.user, req.body);
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
router.post("/customers", adminCustomerParamValidator.listCustomersValidation, AdminAuth, async (req, res) => {
  try {
    const filteredCustomers = await helperCustomer.listCustomers(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, filteredCustomers, "Customer List"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//view individual customer details
router.get("/customer-details/:customerId", adminCustomerParamValidator.viewCustomerDetailsValidation, AdminAuth, async (req, res) => {
  try {
    const customerDetailsResponse = await helperCustomer.customerDetails(req.params.customerId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, customerDetailsResponse, "Customer Details"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//
//**************************Admin Products Routes*******************************
//
//view product list based on filters
router.post("/products", adminProductParamValidator.listProductsValidation, AdminAuth, async (req, res) => {
  try {
    const filteredProducts = await helperProduct.listProducts(req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, filteredProducts, "Product List"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//view individual product details
router.get("/product-details/:productId", adminProductParamValidator.viewProductDetailsValidation, AdminAuth, async (req, res) => {
  try {
    const productDetailsResponse = await helperProduct.productDetails(req.params.productId);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, productDetailsResponse, "Product Details"));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//verify product
router.post("/verify-product", adminProductParamValidator.verifyProductValidation, AdminAuth, async (req, res) => {
  try {
    const verifyProductMessage = await helperProuct.verifyProduct(req.user, req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, verifyProductMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});


//block product
router.post("/block-product", adminProductParamValidator.blockProductValidation, AdminAuth, async (req, res) => {
  try {
    const blockProductMessage = await helperProduct.blockProduct(req.user, req.body);
    res.status(responseCodes.SUCCESS_CODE).send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, blockProductMessage));
  } catch (err) {
    const statusCode = err.status || responseCodes.INTERNAL_SERVER_ERROR_CODE;
    res.status(statusCode).send(commonUtils.responseUtil(statusCode, null, err.message));
  }
});



module.exports = router;
