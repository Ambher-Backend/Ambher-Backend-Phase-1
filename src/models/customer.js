const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");


// Internal Imports
const responseCodes = require("../lib/constants").RESPONSE_CODES;
const commonUtils = require("../lib/common_utils");


dotenv.config();

//defining schema
const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePictureUrl: {
      type: String,
    },
    dob: {
      type: String,
      required: true,
    },
    address: [
      {
        flatNo: { type: String },
        buildingNo: { type: String },
        streetName: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String },
        lat: { type: Number },
        lon: { type: Number },
      },
    ],
    orderIds: [mongoose.Schema.Types.ObjectId],
    cartItemIds: [mongoose.Schema.Types.ObjectId],
    wishListItemIds: [mongoose.Schema.Types.ObjectId],
    configuration: {
      isVerified: {
        type: Boolean,
        required: true,
        default: false,
      },
      isBlocked: {
        type: Boolean,
        required: true,
        default: false,
      }
    },
    blockedReason: {
      type: String,
    },
    reviews: [{
      message: {
        type: String,
        default: ""
      },
      rating: {
        type: Number,
        default: 1
      },
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      pictures: {
        type: [mongoose.Schema.Types.ObjectId],
        validate(value){
          if (value.length > 5){
            commonUtils.generateError(responseCodes.UNPROCESSABLE_ERROR_CODE, "Maximum allowed images are 5");
          }
        },
        default: []
      },
    }],
    rating: {
      type: Number,
      default: 1
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    tokens: {
      type: [String],
    },
    currentToken: {
      type: String,
    },
    emailOtps: {
      type: [String],
    },
    phoneOtps: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//token generation using jwt
CustomerSchema.methods.generateToken = async function() {
  const customer = this;
  const payload = {
    _id: customer._id,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY);
  customer.currentToken = token;
  customer.tokens.push(token);
  await customer.save();
  return token;
};


CustomerSchema.methods.updateReviewStats = async function() {
  let avgRating = 0;
  for (let review of this.reviews){
    avgRating += review.rating;
  }
  if (this.reviews.length !== 0){
    avgRating = avgRating / this.reviews.length;
  }
  avgRating |= 1;
  this.rating = avgRating.toFixed();
  await this.save();
  return this;
};

//static function to find an customer using email and password
CustomerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({
    email: email,
  });
  if (!customer) {
    throw new Error("Customer not found");
  }
  const passwordMatched = await bcrypt.compare(password, customer.password);
  if (!passwordMatched) {
    throw new Error("Password Incorrect");
  }
  return customer;
};

// This validator is trimming all the fields and is removing special characters from string entries.
// Used function because pre method doesn't support arrow functions as call back.
CustomerSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }
  for (const key in this) {
    if (typeof this[key] == "string" && key !== "password") {
      this[key] = this[key].trim();
    }
  }
  next();
});


CustomerSchema.plugin(mongooseFuzzySearching, { fields: ["name"] });
const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
