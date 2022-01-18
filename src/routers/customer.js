const express = require('express');
const config = require('config');
const dotenv = require('dotenv');
const validator = require('validator');
const mongoose = require('mongoose');


// Router Config
const router = new express.Router();
dotenv.config();

//internal imports
const Customer = require('../models/customer');
const commonUtils = require('../lib/common_utils');

//signup route
router.post('/signup', (req, res) => {

    try {
        if (req.body.password.length < 8) {
            throw new Error('Weak Password');
        }
        if (req.body.phoneNumber.length != 10 || req.body.phoneNumber.match(/[0-9]{10}/)[0] != req.body.phoneNumber) {
            throw new Error('Invalid Phone Number');
        }
        if (!validator.isEmail(req.body.email)) {
            throw new Error('Invalid Mail');
        }
        res.send(commonUtils.responseUtil(201, null, "Customer Created"));

    } catch (err) {
        commonUtils.errorLog(err.message);
        res.send(commonUtils.responseUtil(400, null, err.message));
    }
});
router.get('', (req, res) => {
    res.send("Working");
})
module.exports = router;