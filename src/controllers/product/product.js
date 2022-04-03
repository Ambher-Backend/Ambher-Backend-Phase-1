// Internal Imports
const seeder = require("../../../config/database/seeder");


//function to generate 5 admin data or on the basis of request
const generateDummyProducts = async (reqBody) => {
  const adminId = await seeder.generateAndSaveDummyAdmin({});
  const vendorId = await seeder.generateAndSaveDummyVendor({"adminId": adminId});
  const verdict = await seeder.productSeeder(reqBody.deleteExisting, reqBody.total, {"adminId": adminId, "vendorId": vendorId});
  return verdict;
};


module.exports = {generateDummyProducts};
