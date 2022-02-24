const mongoose = require("mongoose");


// Internal Imports
const commonUtils = require('../lib/common_utils');


//defining schema
const CartItemSchema = new mongoose.schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    productItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    cost: {
      type: Number,
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

const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = CartItem;