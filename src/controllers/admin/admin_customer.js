// Internal Imports
const Admin = require("../../models/admin");
const Customer = require("../../models/customer");
const commonUtils = require("../../lib/common_utils");
const fetchFilteredCustomers = require("../../services/fetch_filtered_customers");
const responseCodes = require("../../lib/constants").RESPONSE_CODES;


//
//**************************Admin Customer Controllers/Helpers*******************************
//
const listCustomers = async (reqBody) => {
  const filteredCustomers = await fetchFilteredCustomers.filter(reqBody.filter);
  let filteredCustomersResponse = [];
  for (let customer of filteredCustomers) {
    // TODO: Change the reviews architecture.
    customer = await customer.updateReviewStats();
    const customerResponse = {
      _id: customer._id,
      profilePictureUrl: customer.profilePictureUrl,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      reviews: customer.reviews.length,
      rating: customer.rating,
      totalOrders: customer.orderIds.length
    };
    filteredCustomersResponse.push(customerResponse);
  }
  return commonUtils.paginate(filteredCustomersResponse);
};


const customerDetails = async (customerId) => {
  let customer = await Customer.findById(customerId);
  if (!customer) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Customer Not Found");
  }
  const address = commonUtils.filterObjectByAllowedKeys(
    customer.address[0].toObject(), ["flatNo", "buildingNo", "streetName", "city", "state", "country", "zipcode"]
  );

  customer = await customer.updateReviewStats();
  let customerResponse = {
    _id: customer._id,
    profilePictureUrl: customer.profilePictureUrl,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    address: Object.values(address).join(", "),
    reviews: customer.reviews,
    ratingByVendor: customer.rating,
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

const customerSearch = async (customerEmail) => {
  let customer = await Customer.findOne({email: customerEmail});
  if (!customer) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Customer Not Found");
  }

  customer = await customer.updateReviewStats();
  let customerResponse = {
    _id: customer._id,
    profilePictureUrl: customer.profilePictureUrl,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    reviews: customer.reviews,
    Orders: customer.orderIds.length,
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


module.exports = {listCustomers, customerDetails, customerSearch};
