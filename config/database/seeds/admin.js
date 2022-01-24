const faker = require('faker');


// Internal Imports
const Admin = require('../../../src/models/admin');
const commonUtils = require('../../../src/lib/common_utils');


const generateDummyAdminData = async (deleteExisting, totalToGenerate) => {
  try{
    if (deleteExisting === true){
      await Admin.deleteMany({});
      commonUtils.successLog(`All documents from collection || Admin || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 5 : totalToGenerate);
    for(let i = 0; i < documentsToGenerate; i++) {
      await generateDummyAdmin();
    }
    return `${totalToGenerate} admins generated successfully!`;
  }catch(err){
    return `Error: ||${err.message}|| occured in generating admins`;
  }
}


const generateDummyAdmin = async () => {
  const adminObject = {
    name: faker.name.firstName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email() ,
    password: '12345678',
    configuration: {
      isVerified: true,
      isBlocked: false,
    },
    blockedReason: ''
  };
  const admin = new Admin(adminObject);
  await admin.save();
  return admin._id;
}


module.exports = {generateDummyAdminData, generateDummyAdmin};