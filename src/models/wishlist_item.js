const mongoose = require("mongoose");


// Internal Imports
const commonUtils = require('../lib/common_utils');


//defining schema
const WishlistItemSchema = new mongoose.schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    productItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    timestamp: true
  }
);

const WishlistItem = mongoose.model("WishlistItem", WishlistItemSchema);

module.exports = WishlistItem;
