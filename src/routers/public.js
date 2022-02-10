const express = require("express");

// Router Config
const router = new express.Router();


const relativePath = "..";


//internal imports
const helper = require(`${relativePath}/controllers/public/public`);
const commonUtils = require(`${relativePath}/lib/common_utils`);
const publicValidator = require(`${relativePath}/middlewares/param_validators/public/public`);


//route to get city and state details
router.get("/city-state/:pincode", publicValidator.getCityStateValidation, async (req, res) => {
  try {
    const cityStateDetails = helper.getCityAndState(req.params);
    res.send(commonUtils.responseUtil(200, cityStateDetails, "City and State"));
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, "Error in finding city and state"));
  }
});


//route to get all states
router.get("/state-list", publicValidator.getStateListValidation, async (req, res) => {
  try {
    const stateList = helper.getStates();
    res.send(commonUtils.responseUtil(200, stateList, "State List"));
  } catch (err) {
    commonUtils.errorLog(err.message);
    res.send(commonUtils.responseUtil(400, null, "Error in finding state lists"));
  }
});


module.exports = router;
