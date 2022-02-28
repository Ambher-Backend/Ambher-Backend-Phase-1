const mongoose = require("mongoose");


//defining schema

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    productItemDetails: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      }
    },
    productDetails: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      },
    },
    cartItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    vendorDetails: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      }
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
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
    totalPrice: {
      type: Number,
      required: true,
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
