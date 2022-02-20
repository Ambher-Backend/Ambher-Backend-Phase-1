const mongoose = require("mongoose");


//defining schema

const orderSchema = new mongoose.schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    productItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    cartItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    deliveryAddress: {
      type: {
        flatNo: {type: String},
        buildingNo: {type: String},
        streetName: {type: String},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        zipCode: {type: String, required: true},
        lat: {type: Number},
        lon: {type: Number}
      },
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending approval", "accepted", "rejected", "payment pending", "delivered", "not-delivered", "completed"]
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
