const express = require("express");

// Router Config
const router = new express.Router();


//internal imports
const baseHelper = require("../controllers/public/base");
const commonUtils = require("../lib/common_utils");
const baseParamValidator = require("../middlewares/param_validators/public/base");


const {publicHelper} = baseHelper;
const {publicParamValidator} = baseParamValidator;


//route to get city and state details
router.get("/city-state/:pincode", publicParamValidator.getCityStateValidation, async (req, res) => {
  try {
    const cityStateDetails = publicHelper.getCityAndState(req.params);
    res.send(commonUtils.responseUtil(200, cityStateDetails, "City and State"));
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, "Error in finding city and state"));
  }
});


//route to get all states
router.get("/state-list", publicParamValidator.getStateListValidation, async (req, res) => {
  try {
    const stateList = publicHelper.getStates();
    res.send(commonUtils.responseUtil(200, stateList, "State List"));
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, "Error in finding state lists"));
  }
});


module.exports = router;
