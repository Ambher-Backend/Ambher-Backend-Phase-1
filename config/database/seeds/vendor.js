const mongoose = require('mongoose');
const faker = require('faker');


// Internal Imports
const Vendor = require('../../../src/models/vendor');
const commonUtils = require('../../../src/lib/common_utils');


const generateDummyVendorData = async (deleteExisting, totalToGenerate) => {
  try{
    if (deleteExisting === true){
      await Vendor.deleteMany({});
      commonUtils.successLog(`All documents from collection || Vendor || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 10 : totalToGenerate);
    for(let i = 0; i < documentsToGenerate; i++) {
      await generateDummyVendor();
    }
    return `${totalToGenerate} vendors generated successfully!`;
  }catch(err){
    return `Error: ||${err.message}|| occured in generating vendors`;
  }
}


const generateDummyVendor = async () => {
  const vendorObject = {
    name: faker.name.firstName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email() ,
    password: '12345678',
    dob:faker.date.recent(),
    isVerified: true,
    isBlocked: false,
    blockedReason: '',
    address:[
      {
        flatNo:faker.random.alphaNumeric(2),
        buildingNo:faker.random.alphaNumeric(2),
        streetName:faker.address.streetName(),
        city:faker.address.city(),
        state:faker.address.state(),
        country:faker.address.country(),
        zipCode:faker.address.zipCode(),
        lat:faker.address.latitude(),
        lon:faker.address.longitude()
      }
    ]
  };
  const vendor = new Vendor(vendorObject);
  await vendor.save();
  return vendor._id;
}


module.exports = {generateDummyVendorData};