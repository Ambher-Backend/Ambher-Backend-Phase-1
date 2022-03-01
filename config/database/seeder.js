// Internal Imports
const adminSeeder = require("./seeds/admin").generateDummyAdmins;
const generateAndSaveDummyAdmin = require("./seeds/admin").generateAndSaveDummyAdmin;
const vendorSeeder = require("./seeds/vendor").generateDummyVendors;
const generateAndSaveDummyVendor = require("./seeds/vendor").generateAndSaveDummyVendor;
const customerSeeder = require("./seeds/customer").generateDummyCustomers;
const documentSeeder = require("./seeds/document").generateDummyDocumentData;
const productSeeder = require("./seeds/product").generateDummyProductData;
const reviewSeeder = require("./seeds/review").generateAndSaveDummyReview;


module.exports = {adminSeeder, vendorSeeder, customerSeeder, documentSeeder, productSeeder, reviewSeeder, generateAndSaveDummyAdmin, generateAndSaveDummyVendor};
