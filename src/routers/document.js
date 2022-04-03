const express = require("express");


// Router Config
const router = new express.Router();


// Internal Imports
const baseHelper = require("../controllers/document/base");
const paramsMerger = require("../../config/initializers/router");
const commonUtils = require("../lib/common_utils");
const baseParamValidator = require("../middlewares/param_validators/document/base");


const {documentHelper} = baseHelper;
const {documentParamValidator} = baseParamValidator;

router.use(paramsMerger);

// Creates 5 dummy documents in the database.
router.post("/create-dummy-data", documentParamValidator.generateDocumentDummyDataValidation, async (req, res) => {
  try {
    const verdict = await documentHelper.generateDummyDocuments(req.body);
    res.send(commonUtils.responseUtil(201, null, verdict));
  } catch (err){
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, err.message));
  }
});


module.exports = router;
