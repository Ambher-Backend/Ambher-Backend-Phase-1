const faker = require("faker");
const mongoose = require("mongoose");


// Internal Imports
const commonUtils = require("../../../src/lib/common_utils");


const generateOrderObject = (customer, vendor, product, options) => {
  const orderObject = {
    customerDetails: {
      id: customer._id,
      name: customer.name
    },
    productItemDetails: {
      id: mongoose.Types.ObjectId(),
      imageUrl: faker.image.nature()
    },
    productDetails: {
      id: product._id,
      name: product.name
    },
    cartItemId: options["cartItemId"] || mongoose.Types.ObjectId(),
    vendorDetails: {
      id: product._id,
      name: product.name
    },
    deliveryAddress: {
      flatNo: faker.random.alphaNumeric(2),
      buildingNo: faker.random.alphaNumeric(2),
      streetName: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
      zipCode: faker.address.zipCode(),
      lat: faker.address.latitude(),
      lon: faker.address.longitude()
    },
    startDate: new Date(),
    endDate: new Date(),
    paymentId: mongoose.Types.ObjectId(),
    totalPrice: commonUtils.getRandomNumber(1, 10000),
    status: ["pending approval", "accepted", "rejected", "payment pending", "delivered", "not-delivered", "completed"][commonUtils.getRandomNumber(0, 6)],
    trackingId: mongoose.Types.ObjectId(),
  };
  return orderObject;
};


module.exports = {generateOrderObject};
