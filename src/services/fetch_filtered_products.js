const Product = require('../models/product');


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
  const filteredProducts = buildQueryAndExecute(filter);
  return filteredProducts;
}


const generateCompositeQuery = (filter) => {
  let query = {}
  if (filter['isVerifiedByAdmin'] !== undefined){
    query['configuration.isVerifiedByAdmin'] = filter['isVerifiedByAdmin'];
  }
  if (filter['isBlocked'] !== undefined){
    query['isBlocked'] = filter['isBlocked'];
  }
  return query;
}


const buildQueryAndExecute = async (filter) => {
  const compositeQuery = generateCompositeQuery(filter);
  let filteredProducts = []
  if (filter['query'] !== undefined){
    filteredProducts = await Product.fuzzySearch(filter['query'], compositeQuery);
  }
  else{
    filteredProducts = await Product.find(compositeQuery);
  }
  return filteredProducts;
}


module.exports = {filter};