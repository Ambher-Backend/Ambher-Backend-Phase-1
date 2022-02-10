const relativePath = "../../";


// Internal Imports
const Admin = require(`${relativePath}models/admin`);
const Vendor = require(`${relativePath}models/vendor`);
const commonUtils = require(`${relativePath}lib/common_utils`);
const emailUtils = require(`${relativePath}lib/send_email`);
const fetchFilteredVendors = require(`${relativePath}services/fetch_filtered_vendors`);
const responseCodes = require(`${relativePath}lib/constants`).RESPONSE_CODES;


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
  if (!vendor) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Vendor Not Found");
  }
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
  if (vendor.configuration.isVerified === false) {
    throw commonUtils.generateError(responseCodes.ACCESS_ERROR_CODE, "Vendor needs to verify their email");
  }
  vendor.configuration.isVerifiedByAdmin = true;
  vendor.verifiedBy = admin._id;
  await vendor.save();
  const mailBody = `Congratulations, ${vendor.name}! Your Ambher Vendor Account has been verified.`;
  emailUtils.sendEmail(vendor.email, "Ambher Vendor Account Verified", mailBody);
  return "Vendor Account Verified By Admin Successfully";
};


module.exports = {listVendors, vendorDetails, verifyVendor};