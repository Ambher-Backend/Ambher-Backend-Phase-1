const express = require('express');
const config = require('config');
const dotenv = require('dotenv');


// Router Config
const router = new express.Router();
dotenv.config();

// Internal Imports
const helper = require('../controllers/document');
const commonUtils = require('../lib/common_utils');
const documentParamValidator = require('../param_validators/document');


// Creates 5 dummy documents in the database.
router.post('/create-dummy-data', documentParamValidator.generateDocumentDummyDataValidation, async (req, res) => {
  try{
    await helper.generateDummyDocuments(req.body);
    res.send(commonUtils.responseUtil(201, null, 'Data Created'));
  }catch(err){
    console.log(err);
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


module.exports = router;