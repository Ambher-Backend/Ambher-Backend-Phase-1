const mongoose = require("mongoose");
const utils = require('../lib/common_utils')
const bcrypt = require('bcryptjs')

// Internal Imports
const Admin = require("../models/admin");

//function to generate 5 admin data or on the basis of request
const generateDummyAdmins = async (req, res) => {
    if (req.deleteExisting){
        await Admin.deleteMany({});
        utils.successLog(`All Collection admin deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let adminLength = ((!req.total)?5:0);
    for(let i = 0; i < adminLength; i++) {
        const adminObject = {
            name: 'abcdef',
            phoneNumber: '123457890',
            email: 'test@gmail.com' ,
            password: await bcrypt.hash(password, 8),
            isVerified: true,
            isBlocked: false,
            blockedReason: ''
        };
        const admin = new Admin(adminObject);
        await admin.save();
    }
  return;
};


module.exports = {generateDummyAdmins};