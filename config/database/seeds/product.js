const mongoose = require('mongoose');
const faker = require('faker');


// Internal Imports
const Product = require('../../../src/models/product');
const commonUtils = require('../../../src/lib/common_utils');
const vendorSeeder = require('./vendor').generateDummyVendor;


const generateDummyProductData = async (deleteExisting, totalToGenerate) => {
  try{
    if (deleteExisting === true){
      await Product.deleteMany({});
      commonUtils.successLog(`All documents from collection || Product || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 10 : totalToGenerate);
    for(let i = 0; i < documentsToGenerate; i++) {
      await generateDummyProduct();
    }
    return `${totalToGenerate} products generated successfully!`;
  }catch(err){
    return `Error: ||${err.message}|| occured in generating products`;
  }
}


const generateDummyProduct = async () => {
  const vendorId = await vendorSeeder();
  let zipCodes = []
  let noOfZipCodes = (commonUtils.getOtp() % 10) + 1;
  for(let i = 0;i < noOfZipCodes;i++){
    zipCodes.push(faker.address.zipCode());
  }
  const productObject = {
    name: faker.commerce.productName(),
    vendorId: vendorId,
    description: faker.commerce.productDescription(),
    gender: ['Male', 'Female', 'Unisex'][commonUtils.getOtp() % 3],
    brandName: faker.commerce.productAdjective(),
    deliverablePincode: zipCodes,
    specifications: {
      color: faker.commerce.color(),
      material: faker.commerce.productMaterial(),
    },
    details: generateDummyProductDetails(),
    productCode: commonUtils.genCode(),
    configuration: {
      isVerifiedByAdmin: true
    }
  };
  const product = new Product(productObject);
  await product.save();
  return product._id;
}


const generateDummyProductDetails = () => {
  let details = []
  let nSizes = (commonUtils.getOtp() % 3) + 2;
  for(let i = 0;i < nSizes;i++){
    let detail = {}
    detail['size'] = 30 + (commonUtils.getOtp() % 20) + 2;
    let nColors = (commonUtils.getOtp() % 3) + 2;
    let colorSpecs = []
    while (nColors--){
      let colorSpec = {
        color: faker.commerce.color(),
        pricePerDay: (commonUtils.getOtp() % 1000) + 200,
        displayPictureUrls: [faker.internet.url()],
        quantity: (commonUtils.getOtp() % 100) + 5,
        availableAfter: new Date().toString()
      };
      colorSpecs.push(colorSpec);
    }
    detail['colors'] = colorSpecs;
    details.push(detail);
  }
  return details;
}



module.exports = {generateDummyProductData};