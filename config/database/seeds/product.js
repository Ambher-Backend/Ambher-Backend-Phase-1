const faker = require("faker");


// Internal Imports
const Product = require("../../../src/models/product");
const commonUtils = require("../../../src/lib/common_utils");
const vendorSeeder = require("./vendor").generateDummyVendor;
const adminSeeder = require("./admin").generateDummyAdmin;


const generateDummyProductData = async (deleteExisting, totalToGenerate) => {
  try {
    if (deleteExisting === true){
      await Product.deleteMany({});
      commonUtils.successLog(`All documents from collection || Product || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 10 : totalToGenerate);
    for (let i = 0; i < documentsToGenerate; i++) {
      await generateDummyProduct();
    }
    return `${totalToGenerate} products generated successfully!`;
  } catch (err){
    return `Error: ||${err.message}|| occured in generating products`;
  }
};


const generateDummyProduct = async () => {
  const vendorId = await vendorSeeder();
  const adminId = await adminSeeder();
  let zipCodes = [];
  let noOfZipCodes = commonUtils.getRandomNumber(1, 10);
  for (let i = 0;i < noOfZipCodes;i++){
    zipCodes.push(faker.address.zipCode());
  }
  const productObject = {
    name: faker.commerce.productName(),
    vendorId: vendorId,
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
    verifiedBy: adminId
  };
  const product = new Product(productObject);
  await product.save();
  return product._id;
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
        color: faker.commerce.color(),
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



module.exports = {generateDummyProductData};
