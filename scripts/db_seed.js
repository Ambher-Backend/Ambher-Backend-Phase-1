const faker = require("faker");

require("../config/database/mongo");

console.log(`Seeding on ${process.env.NODE_ENV || "development"} environment`);

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
const {generateDummyProductObject} = require("../config/database/seeds/product");
const {generateGeneralReviewObject} = require("../config/database/seeds/review");


const cleanUp = async () => {
  let deletedAdmins = await Admin.deleteMany({});
  commonUtils.logger(`${deletedAdmins["deletedCount"]} Admins deleted successfully`);
  let deletedVendors = await Vendor.deleteMany({});
  commonUtils.logger(`${deletedVendors["deletedCount"]} Vendors deleted successfully`);
  const deletedCustomers = await Customer.deleteMany({});
  commonUtils.logger(`${deletedCustomers["deletedCount"]} Customers deleted successfully`);
  const deletedProducts = await Product.deleteMany({});
  commonUtils.logger(`${deletedProducts["deletedCount"]} Products deleted successfully`);
  const deletedDocuments = await Document.deleteMany({});
  commonUtils.logger(`${deletedDocuments["deletedCount"]} Documents deleted successfully`);
  const deletedOrders = await Order.deleteMany({});
  commonUtils.logger(`${deletedOrders["deletedCount"]} Orders deleted successfully`);
  const deletedReviews = await Review.deleteMany({});
  commonUtils.logger(`${deletedReviews["deletedCount"]} Reviews deleted successfully`);
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
    commonUtils.logger(`Customer generated with id ${customerId}`);
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
    commonUtils.logger(`Vendor generated with id ${vendorId}`);
  }
  return vendorIds;
};


const seedProducts = async (vendorIds, adminId) => {
  let productIds = [];

  for (const vendorId of vendorIds){
    const vendor = await Vendor.findById(vendorId);
    for (let i = 0;i < 5;i++){
      const productObj = generateDummyProductObject({});

      productObj.vendorDetails = {};
      productObj.vendorDetails.id = vendor._id;
      productObj.vendorDetails.name = vendor.name;
      productObj.vendorDetails.email = vendor.email;
      if (productObj.configuration.isBlocked){
        productObj.blockedBy = adminId;
        productObj.blockedReason = faker.lorem.sentence();
      }
      if (productObj.configuration.isVerifiedByAdmin){
        productObj.verifiedBy = adminId;
      }
      if (!productObj.configuration.isVerifiedByAdmin){
        productObj.verifiedBy = undefined;
      }

      const product = new Product(productObj);
      await product.save();
      productIds.push(product._id);
      commonUtils.logger(`Product generated with id ${product._id}`);
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
      const customerReview = await generateGeneralReviewObject(vendorId);
      await Customer.findOneAndUpdate({_id: customerId}, {reviews: [customerReview]});
      commonUtils.logger("Review generated for Customer given by Vendor");
    }
  }

  // generating review for products given by customers
  for (const customerId of customerIds.slice(1, 6)) {
    for (const productId of productIds.slice(1, 6)){
      const productReview = await generateGeneralReviewObject(customerId);
      await Product.findOneAndUpdate({_id: productId}, {reviews: [productReview]});
      commonUtils.logger("Review generated for Product given by Customer");
    }
  }

  // generating review for vendor given by customers
  for (const customerId of customerIds.slice(1, 6)) {
    for (const vendorId of vendorIds.slice(1, 6)){
      const vendorReview = await generateGeneralReviewObject(customerId);
      await Vendor.findOneAndUpdate({_id: vendorId}, {reviews: [vendorReview]});
      commonUtils.logger("Review generated for Vendor given by Customer");
    }
  }
};


const seeder = async () => {
  // Generating dummy admin
  const adminId = await generateAndSaveDummyAdmin({
    name: "Super Admin",
    email: "admin-test@gmail.com"
  });

  commonUtils.logger(`Admin generated with id ${adminId}`);

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

