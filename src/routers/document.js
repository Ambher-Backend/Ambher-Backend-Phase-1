const express = require("express");


// Router Config
const router = new express.Router();


// Internal Imports
const helper = require("../controllers/document/document");
const commonUtils = require("../lib/common_utils");
const documentParamValidator = require("../middlewares/param_validators/document/document");


// Creates 5 dummy documents in the database.
router.post("/create-dummy-data", documentParamValidator.generateDocumentDummyDataValidation, async (req, res) => {
  try {
    const verdict = await helper.generateDummyDocuments(req.body);
    res.send(commonUtils.responseUtil(201, null, verdict));
  } catch (err){
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


module.exports = router;
