const express = require('express');
const config = require('config');
const dotenv = require('dotenv');


// Router Config
const router = new express.Router();
dotenv.config();

// Internal Imports
const Document = require('../models/document');
const helper = require('../controllers/document');
const commonUtils = require('../lib/common_utils');

// Creates 5 dummy documents in the database.
router.post('/create-dummy-data', async (req, res) => {
  try{
    if (config.util.getEnv('NODE_ENV') == 'production'){
      throw new Error('Dummy Data Creation Not Allowed on Production Server');
    }
    if (req.body.internalAuthKey != process.env.INTERNAL_AUTH_ID){
      throw new Error('Un-authorized access');
    }
    await helper.generateDummyDocuments(req.body);
    res.send(commonUtils.responseUtil(201, null, 'Data Created'));
  }catch(err){
    console.log(err);
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


module.exports = router;