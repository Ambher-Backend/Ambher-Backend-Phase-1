const faker = require("faker");

require("../config/database/mongo");


const Admin = require("../src/models/admin");
const Customer = require("../src/models/customer");
const Vendor = require("../src/models/vendor");
const Product = require("../src/models/product");
const Document = require("../src/models/document");
const Order = require("../src/models/order");
const Review = require("../src/models/review");


const commonUtils = require("../src/lib/common_utils");


const {generateAndSaveDummyAdmin} = require("../config/database/seeds/admin");
const {generateAndSaveDummyCustomer} = require("../config/database/seeds/customer");
const {generateAndSaveDummyVendor} = require("../config/database/seeds/vendor");
const {generateAndSaveDummyProduct} = require("../config/database/seeds/product");
const {generateAndSaveDummyReview} = require("../config/database/seeds/review");


const cleanUp = async () => {
  let deletedAdmins = await Admin.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedAdmins["deletedCount"]} Admins deleted successfully`);
  let deletedVendors = await Vendor.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedVendors["deletedCount"]} Vendors deleted successfully`);
  const deletedCustomers = await Customer.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedCustomers["deletedCount"]} Customers deleted successfully`);
  const deletedProducts = await Product.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedProducts["deletedCount"]} Products deleted successfully`);
  const deletedDocuments = await Document.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedDocuments["deletedCount"]} Documents deleted successfully`);
  const deletedOrders = await Order.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedOrders["deletedCount"]} Orders deleted successfully`);
  const deletedReviews = await Review.deleteMany({});
  console.log(`[${new Date().toString()}] ${deletedReviews["deletedCount"]} Reviews deleted successfully`);
};


const seedCustomers = async (adminId) => {
  let customerIds = [];
  for (let i = 0;i < 20;i++){
    const customerId = await generateAndSaveDummyCustomer({
      "isVerified": commonUtils.getRandomNumber(1, 10) % 2 === 1,
      "isBlocked": commonUtils.getRandomNumber(1, 10) % 2 === 1,
    });

    customerIds.push(customerId);

    const customer = await Customer.findById(customerId);
    if (customer.configuration.isBlocked){
      customer.blockedBy = adminId;
      customer.blockedReason = faker.lorem.sentence();
    }

    await customer.save();
    console.log(`[${new Date().toString()}] Customer generated with id ${customerId}`);
  }
  return customerIds;
};


const seedVendors = async (adminId) => {
  let vendorIds = [];
  for (let i = 0;i < 20;i++){
    const vendorId = await generateAndSaveDummyVendor({
      "isVerified": commonUtils.getRandomNumber(1, 10) % 2 === 1,
      "isBlocked": commonUtils.getRandomNumber(1, 10) % 2 === 1,
      "isVerifiedByAdmin": commonUtils.getRandomNumber(1, 10) % 2 === 1,
    });

    vendorIds.push(vendorId);

    const vendor = await Vendor.findById(vendorId);
    if (vendor.configuration.isBlocked){
      vendor.blockedBy = adminId;
      vendor.blockedReason = faker.lorem.sentence();
    }

    if (vendor.configuration.isVerifiedByAdmin){
      vendor.verifiedBy = adminId;
    }

    vendor.customerOrderIds = [];
    vendor.productIds = [];

    await vendor.save();
    console.log(`[${new Date().toString()}] Vendor generated with id ${vendorId}`);
  }
  return vendorIds;
};


const seedProducts = async (vendorIds, adminId) => {
  let productIds = [];

  for (const vendorId of vendorIds){
    const vendor = await Vendor.findById(vendorId);
    for (let i = 0;i < 5;i++){
      const productId = await generateAndSaveDummyProduct();
      productIds.push(productId);

      const product = await Product.findById(productId);
      product.vendorId = vendor._id;
      if (product.configuration.isBlocked){
        product.blockedBy = adminId;
        product.blockedReason = faker.lorem.sentence();
      }
      if (product.configuration.isVerifiedByAdmin){
        product.verifiedBy = adminId;
      }
      if (!product.configuration.isVerifiedByAdmin){
        product.verifiedBy = undefined;
      }

      await product.save();
      console.log(`[${new Date().toString()}] Product generated with id ${productId}`);
    }
  }
  return productIds;
};


/*
  vendor can give review to customer
  customer can give review to vendor and products
*/
const seedReviews = async (vendorIds, customerIds, productIds) => {
  // generating review for customers given by vendors
  for (const vendorId of vendorIds.slice(1, 6)) {
    for (const customerId of customerIds.slice(1, 6)){
      const reviewId = await generateAndSaveDummyReview(vendorId, customerId);
      console.log(`[${new Date().toString()}] Review generated for Customer given by Vendor with id ${reviewId}`);
    }
  }

  // generating review for products given by customers
  for (const customerId of customerIds.slice(1, 6)) {
    for (const productId of productIds.slice(1, 6)){
      const reviewId = await generateAndSaveDummyReview(customerId, productId);
      console.log(`[${new Date().toString()}] Review generated for Product given by Customer with id ${reviewId}`);
    }
  }

  // generating review for vendor given by customers
  for (const customerId of customerIds.slice(1, 6)) {
    for (const vendorId of vendorIds.slice(1, 6)){
      const reviewId = await generateAndSaveDummyReview(customerId, vendorId);
      console.log(`[${new Date().toString()}] Review generated for Vendor given by Customer with id ${reviewId}`);
    }
  }
};


const seeder = async () => {
  // Generating dummy admin
  const adminId = await generateAndSaveDummyAdmin({
    name: "Super Admin",
    email: "admin-test@gmail.com"
  });

  console.log(`[${new Date().toString()}] Admin generated with id ${adminId}`);

  // Generating customers
  let customerIds = await seedCustomers(adminId);
  let vendorIds = await seedVendors(adminId);
  let productIds = await seedProducts(vendorIds, adminId);
  await seedReviews(vendorIds, customerIds, productIds);
};

cleanUp().then(() => {
  console.log("Data deleted successfully");
  seeder().then(() => {
    console.log("Data generated successfully\nExiting...");
    process.exit();
  }).catch((err) => {
    console.log(err.message);
  });
}).catch((err) => {
  console.log(err.message);
});

