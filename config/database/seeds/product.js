const mongoose = require("mongoose");
const faker = require("faker");


// Internal Imports
const Product = require("../../../src/models/product");
const commonUtils = require("../../../src/lib/common_utils");
const responseCodes = require("../../../src/lib/constants").RESPONSE_CODES;


const generateDummyProductData = async (deleteExisting, totalToGenerate) => {
  try {
    if (deleteExisting === true){
      await Product.deleteMany({});
      commonUtils.successLog(`All documents from collection || Product || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 10 : totalToGenerate);
    for (let i = 0; i < documentsToGenerate; i++) {
      await generateAndSaveDummyProduct();
    }
    return `${totalToGenerate} products generated successfully!`;
  } catch (err){
    throw commonUtils.generateError(responseCodes.INTERNAL_SERVER_ERROR, `Error: ||${err.message}|| occured in generating products`);
  }
};


const generateAndSaveDummyProduct = async (options = {}) => {
  const product = new Product(generateDummyProductObject(options));
  await product.save();
  return product._id;
};


const generateDummyProductObject = (options) => {
  let zipCodes = [];
  let noOfZipCodes = commonUtils.getRandomNumber(1, 10);
  for (let i = 0;i < noOfZipCodes;i++){
    zipCodes.push(faker.address.zipCode());
  }
  const productObject = {
    name: options["name"] || faker.commerce.productName(),
    vendorDetails: {
      id: mongoose.Types.ObjectId(),
      name: faker.company.companyName(),
      email: faker.internet.email()
    },
    description: faker.commerce.productDescription(),
    gender: ["Male", "Female", "Unisex"][commonUtils.getRandomNumber(0, 2)],
    brandName: faker.commerce.productAdjective(),
    deliverablePincode: zipCodes,
    specifications: {
      color: faker.commerce.color(),
      material: faker.commerce.productMaterial(),
    },
    pricePerDay: commonUtils.getRandomNumber(200, 1199),
    details: generateDummyProductDetails(),
    productCode: commonUtils.genCode(),
    configuration: {
      isVerifiedByAdmin: true
    },
    verifiedBy: mongoose.Types.ObjectId()
  };

  return productObject;
};


const generateDummyProductDetails = () => {
  let details = [];
  let nSizes = commonUtils.getRandomNumber(2, 4);
  for (let i = 0;i < nSizes;i++){
    let detail = {};
    detail["size"] = commonUtils.getRandomNumber(32, 51);
    let nColors = commonUtils.getRandomNumber(2, 4);
    let colorSpecs = [];
    while (nColors--){
      let colorSpec = {
        color: commonUtils.generateRandomHexCode(),
        displayPictureUrls: [faker.internet.url()],
        quantity: commonUtils.getRandomNumber(5, 104),
        availableAfter: new Date().toString()
      };
      colorSpecs.push(colorSpec);
    }
    detail["colors"] = colorSpecs;
    details.push(detail);
  }
  return details;
};



module.exports = {generateDummyProductObject, generateDummyProductData, generateAndSaveDummyProduct};
