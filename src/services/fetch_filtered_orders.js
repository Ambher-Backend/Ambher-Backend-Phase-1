//internal imports
const Order = require("../models/order");
const commonUtils = require("../lib/common_utils");



/**
 *
 * @param {An Object} filter
 * {
 *  vendorId: "",
 *  orderId: "",
 *  productId: "",
 *  ...
 * }
 * @returns a mongo query for filtering records based on the filters.
 */const generateCompositeQuery = (filter) => {
  let query = {};
  if (filter["vendorId"] !== undefined){
    query["vendorDetails.id"] = filter["vendorId"];
  }
  if (filter["productId"] !== undefined){
    query["productDetails.id"] = filter["productId"];
  }
  if (filter["orderId"] !== undefined){
    query["_id"] = filter["orderId"];
  }
  return query;
};



/**
 *
 * @param {An Object} filter
 * {
 *  vendorId: "",
 *  orderId: "",
 *  productId: "",
 *  ...
 * }
 * @returns a paginated list of filtered orders sorted in ascending order of end date of order
 */
// TODO: Hotfix: Move this to after validators.
const prepareOrderforAdminView = async (filter) => {
  const orderList = await Order.find(generateCompositeQuery(filter)).sort({endDate: "asc"});
  let filteredOrdersList = [];
  for (let order of orderList) {
    const orderResponse = {
      id: order._id,
      vendorName: order.vendorDetails.name,
      productName: order.productDetails.name,
      status: order.status,
      totalPrice: order.totalPrice,
    };
    filteredOrdersList.push(orderResponse);
  }
  return commonUtils.paginate(filteredOrdersList);
};


module.exports = {prepareOrderforAdminView};
