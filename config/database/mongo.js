const mongoose = require("mongoose");
const config = require("config");

let DbUri = "";

if (process.env.NODE_ENV === "production"){
  DbUri = process.env.PROD_MONGO_URL;
}else{
  DbUri = config.DBHost;
}

const commonUtils = require("../../src/lib/common_utils");

const dbProperties = {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,
  useFindAndModify:false,
};

mongoose.connect(DbUri, dbProperties).then(()=>{
  commonUtils.successLog("Connection to Mongo successful");
}).catch((err) => {
  commonUtils.errorLog(err.message);
});