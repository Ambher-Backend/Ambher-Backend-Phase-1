const mongoose = require("mongoose");
const faker = require("faker");


// Internal Imports
const Vendor = require("../../../src/models/vendor");
const commonUtils = require("../../../src/lib/common_utils");
const adminSeeder = require("./admin").generateDummyAdmin;


const generateDummyVendorData = async (deleteExisting, totalToGenerate) => {
  try {
    if (deleteExisting === true){
      await Vendor.deleteMany({});
      commonUtils.successLog(`All documents from collection || Vendor || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 10 : totalToGenerate);
    for (let i = 0; i < documentsToGenerate; i++) {
      await generateDummyVendor();
    }
    return `${totalToGenerate} vendors generated successfully!`;
  } catch (err){
    return `Error: ||${err.message}|| occured in generating vendors`;
  }
};


const generateDummyVendor = async () => {
  const reviews = generateDummyReviews();
  const adminId = await adminSeeder();
  const vendorObject = {
    name: faker.name.firstName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    password: "12345678",
    dob:faker.date.recent(),
    configuration: {
      isVerified: true,
      isBlocked: false,
      isVerifiedByAdmin: true
    },
    blockedReason: "",
    verifiedBy: adminId,
    address: {
      flatNo:faker.random.alphaNumeric(2),
      buildingNo:faker.random.alphaNumeric(2),
      streetName:faker.address.streetName(),
      city:faker.address.city(),
      state:faker.address.state(),
      country:faker.address.country(),
      zipCode:faker.address.zipCode(),
      lat:faker.address.latitude(),
      lon:faker.address.longitude()
    },
    customerOrderIds: [mongoose.Types.ObjectId()],
    productIds: [
      mongoose.Types.ObjectId(),
      mongoose.Types.ObjectId()
    ],
    supportPhones: [faker.phone.phoneNumber()],
    rating: reviews.rating,
    reviews: reviews.reviews
  };
  const vendor = new Vendor(vendorObject);
  await vendor.save();
  return vendor._id;
};


const generateDummyReviews = () => {
  let numberOfReviews = commonUtils.getRandomNumber(3, 12);
  let rating = 0;
  let reviews = [];
  let totalRatings = 0;
  while (numberOfReviews--){
    const currRating = commonUtils.getRandomNumber(1, 5);
    totalRatings += currRating;
    const review = {
      message: faker.lorem.sentence(),
      reviewRating: currRating,
      customerId: mongoose.Types.ObjectId()
    };
    reviews.push(review);
  }
  rating = totalRatings / reviews.length;
  return {
    rating: rating,
    reviews: reviews
  }; 
};


module.exports = {generateDummyVendorData, generateDummyVendor};
