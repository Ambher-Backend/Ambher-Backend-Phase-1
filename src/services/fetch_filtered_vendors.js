//internal imports
const Vendor = require("../models/vendor");


/* filter: {
  query: '<>',
  isVerified: 'true or false',
  isVerifiedByAdmin: 'true or false',
  isBlocked: 'true or false',
  address: {
    'city': 'delhi',
    'state': 'delhi'
  }
*/
const filter = async (filter) => {
  const filteredVendors = buildQueryAndExecute(filter);
  return filteredVendors;
};


const generateCompositeQuery = (filter) => {
  let query = {};
  if (filter["isVerified"] !== undefined){
    query["configuration.isVerified"] = filter["isVerified"];
  }
  if (filter["isVerifiedByAdmin"] !== undefined){
    query["configuration.isVerifiedByAdmin"] = filter["isVerifiedByAdmin"];
  }
  if (filter["isBlocked"] !== undefined){
    query["configuration.isBlocked"] = filter["isBlocked"];
  }
  if (filter["address"] !== undefined && filter["address"]["city"] !== undefined){
    query["address.city"] = filter["address"]["city"];
  }
  if (filter["address"] !== undefined && filter["address"]["state"] !== undefined){
    query["address.state"] = filter["address"]["state"];
  }
  return query;
};


const buildQueryAndExecute = async (filter) => {
  const compositeQuery = generateCompositeQuery(filter);
  let filteredVendors = [];
  if (filter["query"] !== undefined){
    filteredVendors = await Vendor.fuzzySearch(filter["query"], compositeQuery);
  }
  else {
    filteredVendors = await Vendor.find(compositeQuery);
  }
  return filteredVendors;
};


module.exports = {filter};
