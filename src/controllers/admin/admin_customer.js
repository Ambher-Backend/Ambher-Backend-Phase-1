const relativePath = "../..";


// Internal Imports
const Admin = require(`${relativePath}/models/admin`);
const Customer = require(`${relativePath}/models/customer`);
const commonUtils = require(`${relativePath}/lib/common_utils`);
const fetchFilteredCustomers = require(`${relativePath}/services/fetch_filtered_customers`);
const responseCodes = require(`${relativePath}/lib/constants`).RESPONSE_CODES;


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
  if (!customer) {
    throw commonUtils.generateError(responseCodes.NOT_FOUND_ERROR_CODE, "Customer Not Found");
  }
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


module.exports = {listCustomers, customerDetails};