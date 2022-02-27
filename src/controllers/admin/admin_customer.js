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
    const reviewStats = await customer.updateAndFetchReviewStats();
    const customerResponse = {
      _id: customer._id,
      profilePictureUrl: customer.profilePictureUrl,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      reviews: reviewStats.reviews.length,
      rating: reviewStats.rating,
      totalOrders: customer.orderIds.length
    };
    filteredCustomersResponse.push(customerResponse);
  }
  return commonUtils.paginate(filteredCustomersResponse);
};


const customerDetails = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Customer Not Found");
  }
  const address = commonUtils.filterObjectByAllowedKeys(
    customer.address[0].toObject(), ["flatNo", "buildingNo", "streetName", "city", "state", "country", "zipcode"]
  );

  const reviewStats = await customer.updateAndFetchReviewStats();
  let customerResponse = {
    _id: customer._id,
    profilePictureUrl: customer.profilePictureUrl,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    address: Object.values(address).join(", "),
    reviews: reviewStats.reviews,
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
  const customer = await Customer.findOne({email: customerEmail});
  if (!customer) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Customer Not Found");
  }

  const reviewStats = await customer.updateAndFetchReviewStats();
  let customerResponse = {
    _id: customer._id,
    profilePictureUrl: customer.profilePictureUrl,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    reviews: reviewStats.reviews,
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
