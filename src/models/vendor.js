const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");

dotenv.config();

//defining schema

const VendorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	phoneNumber: {
		type: String,
		unique: true,
		required: true
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
		}
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
    required: true
  },
  address: {
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
		index: true,
  },
  customerOrderIds: [mongoose.Schema.Types.ObjectId],
  productIds: [mongoose.Schema.Types.ObjectId],
	configuration: {
		isVerified: {
			type: Boolean,
			required: true,
			default: false
		},
		isVerifiedByAdmin: {
			type: Boolean,
			required: true,
			default: false
		},
		isBlocked: {
			type: Boolean,
			required: true,
			default: false
		}
	},	
	rating: {
		type: Number,
		default: 1,
		min: 1,
		max: 5
	},
	reviews: {
		type: [
			{
				message: {type: String, default: ""},
				reviewRating: {type: Number, required: true, min: 1, max: 5},
				customerId: {type: mongoose.Schema.Types.ObjectId},
				pictures: {type: [String], default: []}
			}
		]
	},
	verifiedBy: {
		type: mongoose.Schema.Types.ObjectId
	},
	blockedReason: {
		type: String
	},
	blockedBy: {
		type: mongoose.Schema.Types.ObjectId
	},
  tokens: {
		type: [String]
	},
	currentToken: {
		type: String
	},
	emailOtps: {
		type: [String]
	},
	phoneOtps: {
		type: [String]
	},
	supportPhones: {
		type: [String],
		required: true
	}
	},
	{
		timestamps: true,
	}
);


//token generation using jwt
VendorSchema.methods.generateToken = async function() {
	const vendor = this;
	const payload = {
		_id: vendor._id
	};
	const token = jwt.sign(payload, process.env.JWT_KEY);
	vendor.currentToken = token;
	vendor.tokens.push(token);
	await vendor.save();
	return token;
};


//static function to find an admin using email and password
VendorSchema.statics.findByCredentials = async (email, password) => {
	const vendor = await Vendor.findOne({
		email: email
	});
	if (!vendor) {
		throw new Error ("Vendor not found");
	}
	const passwordMatched = await bcrypt.compare(password, vendor.password);
	if (!passwordMatched) {
		throw new Error ("Vendor Password Incorrect");
	}
	return vendor;
};


// This validator is trimming all the fields and is removing special characters from string entries.
// Used function because pre method doesn't support arrow functions as call back.
VendorSchema.pre("save", async function(next) {
	if (this.isModified("password")) {
		const hash = await bcrypt.hash(this.password, 8);
		this.password = hash;
	}
	for (const key in this){
		if (typeof(this[key]) == "string" && key !== "password"){
			this[key] = this[key].trim();
		}
	}
	next();
});


VendorSchema.plugin(mongooseFuzzySearching, { fields: ["name"] });
const Vendor = mongoose.model("Vendor", VendorSchema);


module.exports = Vendor;
