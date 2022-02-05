const express = require("express");

// Router Config
const router = new express.Router();


//internal imports
const helper = require("../controllers/admin");
const commonUtils = require("../lib/common_utils");
const adminParamValidator = require("../param_validators/admin");
const AdminAuth = require("../middlewares/auth/admin_auth");


//
//**************************General Endpoints*******************************
//
//signup route
router.post("/signup", adminParamValidator.signUpParamValidation, async (req, res)=>{
	try {
		await helper.handleSignup(req.body);
		res.send(commonUtils.responseUtil(201, null, "Admin Created"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//login route
router.post("/login", adminParamValidator.loginAdminParamValidation, async (req, res) => {
	try {
		const adminLoginResponse = await helper.handleLogin(req.body);
		res.send(commonUtils.responseUtil(200, adminLoginResponse.adminObjectToExpose, adminLoginResponse.message));
	} catch (err) {
		res.send(commonUtils.responseUtil(400,  null, err.message));
	}
});


//get route for admin details
router.get("/:adminId", adminParamValidator.getAdminParamValidation, AdminAuth, async (req, res) => {
	try {
		const adminResponse = await helper.handleGetDetails(req.params.adminId);
		res.send(commonUtils.responseUtil(200, adminResponse, "Success"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//logout route
router.post("/logout", adminParamValidator.logoutAdminParamValidation, AdminAuth, async (req, res) => {
	try {
		await helper.handleLogout(req.body, req.user);
		res.send(commonUtils.responseUtil(200, null, "Admin Logged out"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	} 
});


//generate dummy data route
router.post("/create-dummy-data", adminParamValidator.generateAdminDummyDataValidation, async (req, res) => {
	try {
		const message = await helper.generateDummyAdmins(req.body);
		res.send(commonUtils.responseUtil(201, null, message));
	} catch (err) {
		res.send(commonUtils.responseUtil(500, null, err.message));
	}
});


//send a new otp to admin email
router.post("/new-email-otp", adminParamValidator.sendEmailOtpValidation, async (req, res) => {
	try {
		await helper.sendEmailOtp(req.body.adminEmail);
		res.send(commonUtils.responseUtil(200, null, "Admin Email OTP sent successfully"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify the email otp of admin
router.post("/verify-email-otp", adminParamValidator.verifyEmailOtpValidation, async (req, res) => {
	try {
		const verifiedEmailOtpMessage = await helper.verifyEmailOtp(req.body);
		res.send(commonUtils.responseUtil(200, null, verifiedEmailOtpMessage));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//
//**************************Admin Vendor Routes*******************************
//
//view vendor list based on filters
router.post("/vendors", adminParamValidator.listVendorsValidation, AdminAuth, async (req, res) => {
	try {
		const filteredVendors = await helper.listVendors(req.body);
		res.send(commonUtils.responseUtil(200, filteredVendors, "Vendor List"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//view individual vendor details
router.get("/vendor-details/:vendorId", adminParamValidator.viewVendorDetailsValidation, AdminAuth, async (req, res) => {
	try {
		const vendorDetailsResponse = await helper.vendorDetails(req.params.vendorId);
		res.send(commonUtils.responseUtil(200, vendorDetailsResponse, "Vendor Details"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify vendor account
router.post("/verify-vendor", adminParamValidator.verifyVendorAccountValidation, AdminAuth, async (req, res) => {
	try {
		const verifyVendorAccountMessage = await helper.verifyVendor(req.user, req.body);
		res.send(commonUtils.responseUtil(200, null, verifyVendorAccountMessage));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//
//**************************Admin Customer Routes*******************************
//
//view customer list based on filters
router.post("/customers", adminParamValidator.listCustomersValidation, AdminAuth, async (req, res) => {
	try {
		const filteredCustomers = await helper.listCustomers(req.body);
		res.send(commonUtils.responseUtil(200, filteredCustomers, "Customer List"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//view individual customer details
router.get("/customer-details/:customerId", adminParamValidator.viewCustomerDetailsValidation, AdminAuth, async (req, res) => {
	try {
		const customerDetailsResponse = await helper.customerDetails(req.params.customerId);
		res.send(commonUtils.responseUtil(200, customerDetailsResponse, "Customer Details"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//
//**************************Admin Products Routes*******************************
//
//view product list based on filters
router.post("/products", adminParamValidator.viewProductsValidation, AdminAuth, async (req, res) => {
	try {
		const filteredProducts = await helper.listProducts(req.body);
		res.send(commonUtils.responseUtil(200, filteredProducts, "Product List"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//view individual product details
router.get("/product-details/:productId", adminParamValidator.viewProductDetailsValidation, AdminAuth, async (req, res) => {
	try {
		const productDetailsResponse = await helper.productDetails(req.params.productId);
		res.send(commonUtils.responseUtil(200, productDetailsResponse, "Product Details"));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//verify product
router.post("/verify-product", adminParamValidator.verifyProductValidation, AdminAuth, async (req, res) => {
	try {
		const verifyProductMessage = await helper.verifyProduct(req.user, req.body);
		res.send(commonUtils.responseUtil(200, null, verifyProductMessage));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});


//block product
router.post("/block-product", adminParamValidator.blockProductValidation, AdminAuth, async (req, res) => {
	try {
		const blockProductMessage = await helper.blockProduct(req.user, req.body);
		res.send(commonUtils.responseUtil(200, null, blockProductMessage));
	} catch (err) {
		res.send(commonUtils.responseUtil(400, null, err.message));
	}
});



module.exports = router;
