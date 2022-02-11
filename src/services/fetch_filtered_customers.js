//internal imports
const Customer = require("../models/customer");


/* filter: {
  query: '<>',
  isVerified: 'true or false',
  isBlocked: 'true or false',
*/
const filter = async (filter) => {
  const filteredCustomers = buildQueryAndExecute(filter);
  return filteredCustomers;
};


const generateCompositeQuery = (filter) => {
  let query = {};
  if (filter["isVerified"] !== undefined) {
    query["configuration.isVerified"] = filter["isVerified"];
  }
  if (filter["isBlocked"] !== undefined) {
    query["configuration.isBlocked"] = filter["isBlocked"];
  }
  return query;
};


const buildQueryAndExecute = async (filter) => {
  const compositeQuery = generateCompositeQuery(filter);
  let filteredCustomers = [];
  if (filter["query"] !== undefined) {
    filteredCustomers = await Customer.fuzzySearch(filter["query"], compositeQuery);
  }
  else {
    filteredCustomers = await Customer.find(compositeQuery);
  }
  return filteredCustomers;
};


module.exports = {filter};
