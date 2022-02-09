const faker = require("faker");


// Internal Imports
const Admin = require("../../../src/models/admin");
const commonUtils = require("../../../src/lib/common_utils");


const generateDummyAdmins = async (deleteExisting, totalToGenerate) => {
  try {
    if (deleteExisting === true){
      await Admin.deleteMany({});
      commonUtils.successLog(`All documents from collection || Admin || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 5 : totalToGenerate);
    for (let i = 0; i < documentsToGenerate; i++) {
      await generateAndSaveDummyAdmin();
    }
    return `${totalToGenerate} admins generated successfully!`;
  } catch (err) {
    return `Error: ||${err.message}|| occurred in generating admins`;
  }
};


const generateAndSaveDummyAdmin = async (options = {}) => {
  const admin = new Admin(generateDummyAdminObject(options = options));
  await admin.save();
  return admin._id;
};


const generateDummyAdminObject = (options = {}) => {
  const adminObject = {
    name: faker.name.firstName(),
    phoneNumber: commonUtils.genPhoneNumber(),
    email: options["email"] || faker.internet.email(),
    password: "12345678",
    configuration: {
      isVerified: options["isVerified"] !== undefined ? options["isVerified"] : true,
      isBlocked: options["isBlocked"] !== undefined ? options["isBlocked"] : false,
    },
    blockedReason: options["isBlocked"] === true ? faker.lorem.sentence() : ""
  };
  return adminObject;
};


module.exports = {generateDummyAdmins, generateAndSaveDummyAdmin, generateDummyAdminObject};
