const faker = require("faker");
const mongoose = require("mongoose");


// Internal Imports
const Document = require("../../../src/models/document");
const commonUtils = require("../../../src/lib/common_utils");


const generateDummyDocumentData = async (deleteExisting, totalToGenerate) => {
  try{
    if (deleteExisting === true){
      await Document.deleteMany({});
      commonUtils.successLog(`All documents from collection || Document || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 10 : totalToGenerate);
    for(let i = 0; i < documentsToGenerate; i++) {
      await generateDummyDocument();
    }
    return `${totalToGenerate} documents generated successfully!`;
  }catch(err){
    return `Error: ||${err.message}|| occured in generating documents`;
  }
};


const generateDummyDocument = async () => {
  const documentObject = {
    name: faker.name.firstName() + ".pdf",
    bucketPath: faker.internet.url(),
    privateLink: faker.internet.url(),
    publicLink: faker.internet.url(),
    ownerUserId: mongoose.Types.ObjectId(),
  };

  const document = new Document(documentObject);
  await document.save();
  return document._id;
};


module.exports = {generateDummyDocumentData, generateDummyDocument};