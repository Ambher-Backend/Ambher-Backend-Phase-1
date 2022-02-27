const Review = require("../models/review");


const fetchReviewStatsByEntityId = async (entityId) => {
  const reviewStats = Review.fetchReviewStats(entityId);
  return reviewStats;
};


module.exports = {fetchReviewStatsByEntityId};
