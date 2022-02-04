const Product = require("../models/product");


/* filter: {
  query: '<>',
  isVerifiedByAdmin: 'true or false',
  isBlocked: 'true or false',
  pincode: [
    '1234',
    '12342'
  ]
*/
const filter = async (filter) => {
  const filteredProducts = buildQueryAndExecute(filter);
  return filteredProducts;
};


const generateCompositeQuery = (filter) => {
  let query = {};
  if (filter["isVerifiedByAdmin"] !== undefined){
    query["configuration.isVerifiedByAdmin"] = filter["isVerifiedByAdmin"];
  }
  if (filter["isBlocked"] !== undefined){
    query["configuration.isBlocked"] = filter["isBlocked"];
  }
  if (filter["pincode"] !== undefined){
    query["deliverablePincode"] = {
      "$in": filter["pincode"]
    };
  }
  if (filter["gender"] !== undefined){
    query["gender"] = filter["gender"];

  }
  return query;
};


const buildQueryAndExecute = async (filter) => {
  const compositeQuery = generateCompositeQuery(filter);
  let filteredProducts = [];
  if (filter["query"] !== undefined){
    filteredProducts = await Product.fuzzySearch(filter["query"], compositeQuery);
  }
  else{
    filteredProducts = await Product.find(compositeQuery);
  }
  return filteredProducts;
};


module.exports = {filter};