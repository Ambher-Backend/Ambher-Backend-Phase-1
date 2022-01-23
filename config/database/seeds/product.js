const mongoose = require('mongoose');
const faker = require('faker');


// Internal Imports
const Product = require('../../../src/models/product');
const commonUtils = require('../../../src/lib/common_utils');




module.exports = {generateDummyAdminData};