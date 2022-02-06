const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

//defining schema

const AdminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
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
	configuration: {
		isVerified: {
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
	blockedReason: {
		type: String,
		default: ""
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
	}
	},
	{
		timestamps: true,
	}
);


//token generation using jwt
AdminSchema.methods.generateToken = async function() {
	const admin = this;
	const payload = {
		_id: admin._id
	};
	const token = jwt.sign(payload, process.env.JWT_KEY);
	admin.currentToken = token;
	admin.tokens.push(token);
	await admin.save();
	return token;
};


//static function to find an admin using email and password
AdminSchema.statics.findByCredentials = async (email, password) => {
	const admin = await Admin.findOne({
		email: email,
	});
	if (!admin) {
		let err = new Error ("Admin not found");
		err.status = 422;
		throw err;
	}
	const passwordMatched = await bcrypt.compare(password, admin.password);
	if (!passwordMatched) {
		let err = new Error ("Password Incorrect");
		err.status = 422;
		throw err;
	}
	return admin;
};


// This validator is trimming all the fields and is removing special characters from string entries.
// Used function because pre method doesn't support arrow functions as call back.
AdminSchema.pre("save", async function(next) {
	if (this.isModified("password")) {
		const hash = await bcrypt.hash(this.password, 8);
		this.password = hash;
	}
	for (const key in this){
		if (typeof(this[key]) === "string" && key !== "password"){
			this[key] = this[key].trim();
		}
	}
	next();
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
