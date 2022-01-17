const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dotenv = require("dotenv");


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
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Error");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    blockedReason: {
        type: String
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
AdminSchema.methods.generateToken = async function () {
    const admin = this;
    const payload = {
        _id: admin._id
    };
    const token = jwt.sign(payload, process.env.INTERNAL_AUTH_ID);
    admin.currentToken = token;
    admin.tokens.push(token);
    await admin.save();
    return token;
};

//static function to find an admin using email and password
AdminSchema.statics.findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({
        email: email,
        isVerified: true,
        isBlocked: false
    });
    if (!admin) {
        throw new Error ("Admin not found");
    }
    const passwordMatched = await bcrypt.compare(password, admin.password);
    if(!passwordMatched) {
        throw new Error ("Password Incorrect");
    }
    return admin;
};

// This validator is trimming all the fields and is removing special characters from string entries.
// Used function because pre method doesn't support arrow functions as call back.
AdminSchema.pre('save', async function(next) {
    if(this.isModified("password")) {
        const hash = await bcrypt.hash(this.password, 8);
        this.password = hash;
    }
    for(const key in this){
        if (typeof(this[key]) == 'string'){
          this[key] = this[key].trim();
        }
      }
    this.name = this.name.replace(/^A-Za-z0-9_\-/,'_');
    next();

});

const admin = mongoose.model("admin",AdminSchema);

module.exports = admin;