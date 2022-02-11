const express = require("express");

// Router Config
const router = new express.Router();


//internal imports
const baseHelper = require("../controllers/product/base");
const commonUtils = require("../lib/common_utils");
const baseParamValidator = require("../middlewares/param_validators/product/base");


const {productHelper} = baseHelper;
const {productParamValidator} = baseParamValidator;


//generate dummy data route
router.post("/create-dummy-data", productParamValidator.generateProductDummyDataValidation, async (req, res) => {
  try {
    const message = await productHelper.generateDummyProducts(req.body);
    res.send(commonUtils.responseUtil(201, null, message));
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(500, null, err.message));
  }
});


module.exports = router;
