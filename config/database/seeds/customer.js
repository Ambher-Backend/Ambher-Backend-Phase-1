const faker = require("faker");
const mongoose = require("mongoose");

// Internal Imports
const Customer = require("../../../src/models/customer");
const commonUtils = require("../../../src/lib/common_utils");


const generateDummyCustomerData = async (deleteExisting, totalToGenerate) => {
  try {
    if (deleteExisting === true){
      await Customer.deleteMany({});
      commonUtils.successLog(`All documents from collection || Customer || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 5 : totalToGenerate);
    for (let i = 0; i < documentsToGenerate; i++) {
      await generateAndSaveDummyCustomer();
    }
    return `${totalToGenerate} customers generated successfully!`;
  } catch (err){
    return `Error: ||${err.message}|| occured in generating customers`;
  }
};


const generateAndSaveDummyCustomer = async (options = {}) => {
  const customer = new Customer(generateDummyCustomerObject(options = options));
  await customer.save();
  return customer._id;
};


const generateDummyCustomerObject = (options = {}) => {
  const customerObject = {
    name: faker.name.firstName(),
    phoneNumber: commonUtils.genPhoneNumber(),
    email: options["email"] === undefined ? faker.internet.email() : options["email"],
    password: "12345678",
    dob: faker.date.recent(),
    configuration: {
      isVerified: options["isVerified"] !== undefined ? options["isVerified"] : true,
      isBlocked: options["isBlocked"] !== undefined ? options["isBlocked"] : false,
    },
    blockedReason: "",
    address: [
      {
        flatNo: faker.random.alphaNumeric(2),
        buildingNo: faker.random.alphaNumeric(2),
        streetName: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
        lat: faker.address.latitude(),
        lon: faker.address.longitude()
      }
    ],
  };
  if (options["isVerified"] === true){
    customerObject.reviews = generateDummyReviews();
  }
  return customerObject;
};


const generateDummyReviews = () => {
  let numberOfReviews = commonUtils.getRandomNumber(3, 12);
  let reviews = [];
  while (numberOfReviews--){
    const currRating = commonUtils.getRandomNumber(1, 5);
    const review = {
      message: faker.lorem.sentence(),
      reviewRating: currRating,
      productId: mongoose.Types.ObjectId()
    };
    reviews.push(review);
  }
  return reviews;
};



module.exports = {generateDummyCustomerData, generateAndSaveDummyCustomer, generateDummyCustomerObject};
