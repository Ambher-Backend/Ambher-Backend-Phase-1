const express = require("express");

// Router Config
const router = new express.Router();


//internal imports
const helper = require("../controllers/product/product");
const commonUtils = require("../lib/common_utils");
const productParamValidator = require("../middlewares/param_validators/product/product");


//generate dummy data route
router.post("/create-dummy-data", productParamValidator.generateProductDummyDataValidation, async (req, res) => {
  try {
    const message = await helper.generateDummyProducts(req.body);
    res.send(commonUtils.responseUtil(201, null, message));
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(500, null, err.message));
  }
});


module.exports = router;
