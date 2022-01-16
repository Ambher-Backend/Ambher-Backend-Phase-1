const faker = require("faker");
const mongoose = require("mongoose");

// Internal Imports
const Document = require("../models/document");

const generateDummyDocuments = async (reqBody) => {
  if (reqBody.deleteExisting){
    await Document.deleteMany({});
    console.log(`All Collection documents deleted on "${new Date().toString()}" by 'Admin'`);
  }
  let totalDocuments = ((reqBody.total == undefined) ? 5 : reqBody.total);
  for (let i = 0; i < totalDocuments; i++) {
    const documentObject = {
      name: faker.name.firstName() + ".pdf",
      bucketPath: faker.internet.url(),
      privateLink: faker.internet.url(),
      publicLink: faker.internet.url(),
      ownerUserId: mongoose.Types.ObjectId(),
    };

    const document = new Document(documentObject);
    await document.save();
  }
  return;
};


module.exports = {generateDummyDocuments};