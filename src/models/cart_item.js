const mongoose = require("mongoose");


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
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamp: true
  }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = CartItem;
