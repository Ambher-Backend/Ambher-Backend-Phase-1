const mongoose = require("mongoose");


//defining schema

const orderSchema = new mongoose.schema(
  {
    customerId: {
      type: String,
      required: true
    },
    productItemId: {
      type: String,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    cartItemId: {
      type: String,
      required: true
    },
    vendorId: {
      type: String,
      required: true
    },
    paymentId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending approval", "accepted", "rejected", "delivered", "not-delivered", "completed"]
      }
    },
    trackingId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  });

orderSchema.pre("save", async function(next) {
  for (const key in this){
    if (typeof(this[key]) == "string"){
      this[key] = this[key].trim();
    }
  }
  next();
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
