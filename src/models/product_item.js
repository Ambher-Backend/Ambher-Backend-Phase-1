const mongoose = require("mongoose");


//defining schema
const ProductItemSchema = new mongoose.schema(
  {
    parentProductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    available: {
      type: Boolean,
      default: false
    },
    cartItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    wishlistId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  },
  {
    timestamp: true
  }
);

const ProductItem = mongoose.model("ProductItem", ProductItemSchema);

module.exports = ProductItem;
