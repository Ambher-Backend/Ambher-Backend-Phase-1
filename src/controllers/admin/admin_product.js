// Internal Imports
const Admin = require("../../models/admin");
const Vendor = require("../../models/vendor");
const Product = require("../../models/product");
const commonUtils = require("../../lib/common_utils");
const emailUtils = require("../../lib/send_email");
const fetchFilteredProducts = require("../../services/fetch_filtered_products");
const {prepareOrderforAdminView} = require("../../services/fetch_filtered_orders");
const responseCodes = require("../../lib/constants").RESPONSE_CODES;


//
//**************************Admin Products Controllers/Helpers*******************************
//
//TODO: Hotfix: currently orders is 10, but when database is set change it.
const listProducts = async (reqBody) => {
  const filteredProducts = await fetchFilteredProducts.filter(reqBody.filter);
  let filteredProductsResponse = [];
  for (let product of filteredProducts) {
    const productResponse = {
      _id: product._id,
      displayPicture: product.details[0].colors[0].displayPictureUrls[0],
      name: product.name,
      shopName: product.vendorDetails.name,
      orders: 10,
      details: product.details.map(sizeColorDetail => {
        const sizeColorsFiltered = {};
        sizeColorsFiltered["size"] = sizeColorDetail["size"];
        sizeColorsFiltered["colors"] = sizeColorDetail["colors"].map(colorDetails => colorDetails.color);
        return sizeColorsFiltered;
      }),
      rentalPrice: product.pricePerDay,
      rating: product.rating,
      isVerified: product.configuration.isVerifiedByAdmin,
      isBlocked: product.configuration.isBlocked
    };
    filteredProductsResponse.push(productResponse);
  }
  return commonUtils.paginate(filteredProductsResponse);
};


//TODO: Add support for orders once schema is ready.
const productDetails = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Product Not Found");
  }

  const reviewStats = await product.updateReviewStats();
  const ownerVendor = await Vendor.findById(product.vendorDetails.id);
  let productResponse = {
    _id: product._id,
    profilePictureUrl: product.profilePictureUrl,
    name: product.name,
    shopName: ownerVendor.name,
    reviews: reviewStats.reviews,
    details: product.details.map(sizeColorDetail => {
      const sizeColorsFiltered = {};
      sizeColorsFiltered["size"] = sizeColorDetail["size"];
      sizeColorsFiltered["colors"] = sizeColorDetail["colors"].map(colorDetails => colorDetails.color);
      return sizeColorsFiltered;
    }),
    rating: reviewStats.rating,
    isVerified: product.configuration.isVerifiedByAdmin,
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
  if (!product) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Invalid product ID");
  }
  const ownerVendor = await Vendor.findById(product.vendorId);
  if (!ownerVendor.configuration.isVerified) {
    throw commonUtils.generateError(responseCodes.ACCESS_ERROR_CODE, "Owner Vendor Email is not verified");
  }
  if (!ownerVendor.configuration.isVerifiedByAdmin) {
    throw commonUtils.generateError(responseCodes.ACCESS_ERROR_CODE, "Owner Vendor Admin verification is pending");
  }
  if (ownerVendor.configuration.isBlocked === true) {
    throw commonUtils.generateError(responseCodes.ACCESS_ERROR_CODE, "Owner Vendor is blocked");
  }
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
  if (!product) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Invalid product ID");
  }
  if (product.configuration.isVerifiedByAdmin === false) {
    throw commonUtils.generateError(responseCodes.ACCESS_ERROR_CODE, "Product needs to be verified first");
  }
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


const listOrders = async (productId) => {
  const filteredOrdersList = await prepareOrderforAdminView({productId: productId});
  return filteredOrdersList;
};


module.exports = {listProducts, productDetails, verifyProduct, blockProduct, listOrders};
