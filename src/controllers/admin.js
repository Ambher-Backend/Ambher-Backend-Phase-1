// Internal Imports
const Admin = require("../models/admin");
const Vendor = require("../models/vendor");
const Customer = require("../models/customer");
const Product = require("../models/product");
const commonUtils = require("../lib/common_utils");
const emailUtils = require("../lib/send_email");
const seeder = require("../../config/database/seeder");
const fetchFilteredVendors = require("../services/fetch_filtered_vendors");
const fetchFilteredCustomers = require("../services/fetch_filtered_customers");
const fetchFilteredProducts = require("../services/fetch_filtered_products");


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


const handleGetDetails = async (adminId) => {
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
  if (admin === undefined){throw new Error("Invalid Email, Admin Not registered");}
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
  if (admin === undefined){throw new Error("Invalid Email, Admin Not registered");}
  const otpToVerify = admin.emailOtps[admin.emailOtps.length - 1];
  if (otpToVerify === reqBody.otp) {
    admin.configuration.isVerified = true;
    await admin.save();
    return "Admin Email OTP verified successfully";
  }
  else {
    throw new Error("Wrong Admin Email OTP");
  }
};


//
//**************************Admin Vendor Controllers/Helpers*******************************
//
const listVendors = async (reqBody) => {
  const filteredVendors = await fetchFilteredVendors.filter(reqBody.filter);
  let filteredVendorsResponse = [];
  for (let vendor of filteredVendors){
    const vendorResponse = {
      _id: vendor._id,
      profilePictureUrl: vendor.profilePictureUrl,
      name: vendor.name,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      address: Object.values(vendor.address).join(", "),
      reviews: vendor.reviews.length,
      rating: vendor.rating,
      totalOrders: vendor.customerOrderIds.length,
      totalProducts: vendor.productIds.length
    };
    filteredVendorsResponse.push(vendorResponse);
  }
  return commonUtils.paginate(filteredVendorsResponse);
};


const vendorDetails = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {throw new Error ("Vendor Not Found");}
  const address = commonUtils.filterObjectByAllowedKeys(
    vendor.address, ["flatNo", "buildingNo", "streetName", "city", "state", "country", "zipcode"]
  );
  let vendorResponse = {
    _id: vendor._id,
    profilePictureUrl: vendor.profilePictureUrl,
    name: vendor.name,
    phoneNumber: vendor.phoneNumber,
    email: vendor.email,
    address: Object.values(address).join(", "),
    totalOrders: vendor.customerOrderIds.length,
    totalProducts: vendor.productIds.length,
    rating: vendor.reviews.rating,
    isVerifiedByAdmin: vendor.configuration.isVerifiedByAdmin,
    isVerified: vendor.configuration.isVerified,
    isBlocked: vendor.configuration.isBlocked,
  };
  if (vendor.configuration.isBlocked === true) {
    const blockedAdmin = await Admin.findById (vendor.blockedBy);
    vendorResponse.blockedReason = vendor.blockedReason;
    vendorResponse.blockedBy = blockedAdmin.name;
    vendorResponse.blockedByEmail = blockedAdmin.email;
  }
  if (vendor.configuration.isVerifiedByAdmin === true) {
    const verifiedByAdmin = await Admin.findById(vendor.verifiedBy);
    vendorResponse.verifiedByEmail = verifiedByAdmin.email;
    vendorResponse.verifiedByName = verifiedByAdmin.name;
  }
  return vendorResponse;
};


const verifyVendor = async (admin, reqBody) => {
  let vendor = await Vendor.findById(reqBody.vendorId);
  if (vendor === undefined){throw new Error("Invalid vendor ID");}
  if (vendor.configuration.isVerified === false){throw new Error("Vendor needs to verify their email");}
  vendor.configuration.isVerifiedByAdmin = true;
  vendor.verifiedBy = admin._id;
  await vendor.save();
  const mailBody = `Congratulations, ${vendor.name}! Your Ambher Vendor Account has been verified.`;
  emailUtils.sendEmail(vendor.email, "Ambher Vendor Account Verified", mailBody);
  return "Vendor Account Verified By Admin Successfully";
};


//
//**************************Admin Customer Controllers/Helpers*******************************
//
const listCustomers = async (reqBody) => {
  const filteredCustomers = await fetchFilteredCustomers.filter(reqBody.filter);
  let filteredCustomersResponse = [];
  for (let customer of filteredCustomers) {
    const customerResponse = {
      _id: customer._id,
      profilePictureUrl: customer.profilePictureUrl,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      reviews: customer.reviews.length,
      totalOrders: customer.orderIds.length
    };
    filteredCustomersResponse.push(customerResponse);
  }
  return commonUtils.paginate(filteredCustomersResponse);
};


const customerDetails = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {throw new Error ("Customer Not Found");}
  const address = commonUtils.filterObjectByAllowedKeys(
    customer.address[0].toObject(), ["flatNo", "buildingNo", "streetName", "city", "state", "country", "zipcode"]
  );
  let customerResponse = {
    _id: customer._id,
    profilePictureUrl: customer.profilePictureUrl,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    address: Object.values(address).join(", "),
    reviews: customer.reviews,
    totalOrders: customer.orderIds.length,
    isVerified: customer.configuration.isVerified,
    isBlocked: customer.configuration.isBlocked,
  };
  if (customer.configuration.isBlocked === true) {
    const blockedAdmin = await Admin.findById (customer.blockedBy);
    customerResponse.blockedReason = customer.blockedReason;
    customerResponse.blockedBy = blockedAdmin.name;
    customerResponse.blockedByEmail = blockedAdmin.email;
  }
  return customerResponse;
};


//
//**************************Admin Products Controllers/Helpers*******************************
//
//TODO: Hotfix: currently orders is 10, but when database is set change it.
const listProducts = async (reqBody) => {
  const filteredProducts = await fetchFilteredProducts.filter(reqBody.filter);
  let filteredProductsResponse = [];
  for (let product of filteredProducts) {
    const ownerVendor = await Vendor.findById(product.vendorId);
    const productResponse = {
      _id: product._id,
      displayPicture: product.details[0].colors[0].displayPictureUrls[0],
      name: product.name,
      shopName: ownerVendor.name,
      orders: 10,
      details: product.details.map(sizeColorDetail => {
        const sizeColorsFiltered = {};
        sizeColorsFiltered["size"] = sizeColorDetail["size"];
        sizeColorsFiltered["colors"] = sizeColorDetail["colors"].map(colorDetails => colorDetails.color);
        return sizeColorsFiltered;
      }),
      rating: product.rating
    };
    filteredProductsResponse.push(productResponse);
  }
  return commonUtils.paginate(filteredProductsResponse);
};


//TODO: Add support for orders once schema is ready.
const productDetails = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {throw new Error ("Product Not Found");}
  const ownerVendor = await Vendor.findById(product.vendorId);
  let productResponse = {
    _id: product._id,
    profilePictureUrl: product.profilePictureUrl,
    name: product.name,
    shopName: ownerVendor.name,
    reviews: product.customerReviews,
    details: product.details.map(sizeColorDetail => {
      const sizeColorsFiltered = {};
      sizeColorsFiltered["size"] = sizeColorDetail["size"];
      sizeColorsFiltered["colors"] = sizeColorDetail["colors"].map(colorDetails => colorDetails.color);
      return sizeColorsFiltered;
    }),
    rating: product.rating,
    isVerifiedByAdmin: product.configuration.isVerifiedByAdmin,
    isBlocked: product.configuration.isBlocked,
  };
  if (product.configuration.isBlocked === true) {
    const blockedAdmin = await Admin.findById(product.blockedBy);
    productResponse.blockedReason = product.blockedReason;
    productResponse.blockedBy = blockedAdmin.name;
    productResponse.blockedByEmail = blockedAdmin.email;
  }
  if (product.configuration.isVerifiedByAdmin === true) {
    const verifiedByAdmin = await Admin.findById(product.verifiedBy);
    productResponse.verifiedByEmail = verifiedByAdmin.email;
    productResponse.verifiedByName = verifiedByAdmin.name;
  }
  return productResponse;
};


const verifyProduct = async (admin, reqBody) => {
  let product = await Product.findById(reqBody.productId);
  if (product === undefined){throw new Error("Invalid product ID");}
  product.configuration.isVerifiedByAdmin = true;
  product.verifiedBy = admin._id;
  await product.save();
  const associatedVendor = await Vendor.findById(product.vendorId);
  const mailBody = `Dear ${associatedVendor.name}!,\n Your Product ${product.name} has been verified
	by admin.`;
  emailUtils.sendEmail(associatedVendor.email, `Product-${product.name} verified!`, mailBody);
  return "Product Verified By Admin Successfully";
};


const blockProduct = async (admin, reqBody) => {
  let product = await Product.findById(reqBody.productId);
  if (product === undefined){throw new Error("Invalid product ID");}
  product.configuration.isBlocked = true;
  product.blockedBy = admin._id;
  product.blockedReason = reqBody.blockedReason;
  await product.save();
  const associatedVendor = await Vendor.findById(product.vendorId);
  const mailBody = `Dear ${associatedVendor.name}!,\n Your Product ${product.name} has been blocked
	by admin due to <b>${reqBody.blockedReason}</b>.\nPlease contact support in case of issues.`;
  emailUtils.sendEmail(associatedVendor.email, `Product-${product.name} blocked`, mailBody);
  return "Product Blocked By Admin Successfully";
};


module.exports = {generateDummyAdmins, handleSignup, handleLogin, handleLogout,
  handleGetDetails, sendEmailOtp, verifyEmailOtp, listVendors, vendorDetails,
  verifyVendor, listCustomers, customerDetails, listProducts, productDetails,
  verifyProduct, blockProduct};
