const mongoose = require("mongoose");


// Internal Imports
const responseCodes = require("../lib/constants").RESPONSE_CODES;
const commonUtils = require("../lib/common_utils");


const ReviewSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  pictures: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    validate(value){
      if (value.length > 5){
        commonUtils.generateError(responseCodes.UNPROCESSABLE_ERROR_CODE, "Maximum allowed images are 5");
      }
    },
    default: []
  },
});


ReviewSchema.statics.fetchReviewStats = async (entityId) => {
  const reviews = await Review.find({"entityId": entityId});
  let avgRating = 0;
  for (let review of reviews){
    avgRating += review.rating;
  }
  if (reviews.length !== 0){
    avgRating = avgRating / reviews.length;
  }
  avgRating |= 1;
  return {
    rating: avgRating.toFixed(1),
    reviews: reviews
  };
};


const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;

