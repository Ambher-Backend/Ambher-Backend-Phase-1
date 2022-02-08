// Internal Imports
const adminSeeder = require("./seeds/admin").generateDummyAdmins;
const vendorSeeder = require("./seeds/vendor").generateDummyVendors;
const customerSeeder = require("./seeds/customer").generateDummyCustomerData;
const documentSeeder = require("./seeds/document").generateDummyDocumentData;
const productSeeder = require("./seeds/product").generateDummyProductData;


module.exports = {adminSeeder, vendorSeeder, customerSeeder, documentSeeder, productSeeder};
