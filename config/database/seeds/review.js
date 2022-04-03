const faker = require("faker");


// Internal Imports
const Review = require("../../../src/models/review");
const commonUtils = require("../../../src/lib/common_utils");


const generateAndSaveDummyReview = async (ownerId, entityId, options = {}) => {
  const reviewObject = generateReviewObject(ownerId, entityId, options);
  const review = new Review(reviewObject);
  await review.save();
  return review._id;
};


const generateReviewObject = (ownerId, entityId, options) => {
  const reviewObject = {
    message: options["message"] || faker.lorem.sentence(),
    rating: commonUtils.getRandomNumber(1, 5),
    entityId: entityId,
    ownerId: ownerId,
    pictures: []
  };
  return reviewObject;
};


const generateGeneralReviewObject = (ownerId, options = {}) => {
  const reviewObject = {
    message: options["message"] || faker.lorem.sentence(),
    rating: commonUtils.getRandomNumber(1, 5),
    ownerId: ownerId,
    pictures: []
  };
  return reviewObject;
};


module.exports = {generateAndSaveDummyReview, generateGeneralReviewObject};
