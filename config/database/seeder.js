// Internal Imports
const {generateAndSaveDummyAdmin, generateDummyAdmins: adminSeeder} = require("./seeds/admin");
const {generateAndSaveDummyVendor, generateDummyVendors: vendorSeeder} = require("./seeds/vendor");
const customerSeeder = require("./seeds/customer").generateDummyCustomers;
const documentSeeder = require("./seeds/document").generateDummyDocumentData;
const productSeeder = require("./seeds/product").generateDummyProductData;
const reviewSeeder = require("./seeds/review").generateAndSaveDummyReview;


module.exports = {adminSeeder, vendorSeeder, customerSeeder, documentSeeder, productSeeder, reviewSeeder, generateAndSaveDummyAdmin, generateAndSaveDummyVendor};
