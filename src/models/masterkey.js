const md5 = require("md5");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MasterKeySchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);


// 1 day
const masterKeyBuffer = 86400;


MasterKeySchema.statics.generate = async () => {
  // delete all existing Masterkey existing in the database
  await Masterkey.deleteMany({});
  const masterKeyData = {
    masterKey: process.env.MASTER_KEY_BASE,
    generationTime: new Date().getTime()
  };
  const hashedKey = md5(JSON.stringify(masterKeyData));
  const masterkeyObject = new Masterkey({key: hashedKey, data: JSON.stringify(masterKeyData)});
  await masterkeyObject.save();
  return hashedKey;
};


MasterKeySchema.statics.isValid = async (key) => {
  const masterkey = await Masterkey.find({key: key});
  if (!masterkey){
    return false;
  }
  const masterKeyObject = JSON.parse(masterkey.data);
  const requestTimeInSeconds = new Date().getTime() / 1000;
  if (requestTimeInSeconds - masterKeyObject.generationTime >= masterKeyBuffer && JSON.parse(masterkey.data).masterKey === process.env.MASTER_KEY_BASE){
    return true;
  }
  return false;
};


const Masterkey = mongoose.model("Masterkey", MasterKeySchema);

module.exports = Masterkey;
