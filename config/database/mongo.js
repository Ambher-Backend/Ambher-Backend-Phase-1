const mongoose = require('mongoose');
const config = require('config');

const DbUri = config.DBHost;

const commonUtils = require('../../src/lib/common_utils')

const dbProperties = {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,
  useFindAndModify:false,
};

mongoose.connect(DbUri, dbProperties).then(()=>{
  commonUtils.successLog(`Connection to Mongo successful`);
}).catch((err) => {
  commonUtils.errorLog(err.message)
})