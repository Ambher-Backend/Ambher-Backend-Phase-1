const mongoose = require("mongoose");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");


const relativePath = "..";


// Internal Imports
const commonUtils = require(`${relativePath}/lib/common_utils`);

//defining schema

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Unisex"],
        message: "{VALUE} gender is not supported"
      },
      required: true
    },
    brandName: {
      type: String,
      required: true,
    },
    deliverablePincode: {
      type: [String],
      required: true,
      validate(value) {
        if (value.length === 0) {
          throw new Error("One deliverable pincode required");
        }
      }
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    details: {
      type: [
        {
          size: {type: String, required: true},
          colors: [
            {
              color: {type: String, required: true},
              displayPictureUrls: {type: [String], required: true},
              quantity: {type: Number, required: true},
              availableAfter: {type: String, required: true}
            }
          ]
        }
      ],
      required: true,
      validate(value){
        if (value.length === 0){
          throw new Error("One color and size specification is required!");
        }
        if (value[0].colors.length === 0){
          throw new Error("At-least one color specification is required!");
        }
      }
    },
    // this is a mixed type field, it will be single-nested key value pair object,
    // whenever update is done on this key, perform: product.markModified('specifications');
    specifications: {
      type: mongoose.Mixed,
      default: {}
    },
    rating: {
      type: Number,
      default: 0
    },
    customerReviews: {
      type: [
        {
          message: {type: String, default: ""},
          rating: {type: Number, required: true, min: 1, max: 5},
          pictures: {type: [String], default: []}
        }
      ]
    },
    numberOfRatings: {
      type: Number,
      default: 0
    },
    productCode: {
      type: String,
      required: true
    },
    configuration: {
      isVerifiedByAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      isBlocked: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    blockedReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


// This validator is trimming all the fields and is removing special characters from string entries.
// Used function because pre method doesn't support arrow functions as call back.
ProductSchema.pre("save", async function(next) {
  for (const key in this) {
    if (typeof this[key] == "string") {
      this[key] = this[key].trim();
    }
  }
  if (this["productCode"] === undefined){
    this["productCode"] = commonUtils.genCode(10);
  }
  next();
});

ProductSchema.plugin(mongooseFuzzySearching, { fields: ["name"] });
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
