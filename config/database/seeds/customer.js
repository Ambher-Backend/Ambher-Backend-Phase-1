const faker = require('faker');


// Internal Imports
const Customer = require('../../../src/models/customer');
const commonUtils = require('../../../src/lib/common_utils');


const generateDummyCustomerData = async (deleteExisting, totalToGenerate) => {
  try{
    if (deleteExisting === true){
      await Customer.deleteMany({});
      commonUtils.successLog(`All documents from collection || Customer || deleted on "${new Date().toString()}" by 'Admin'`);
    }
    let documentsToGenerate = ( (!totalToGenerate) ? 5 : totalToGenerate);
    for(let i = 0; i < documentsToGenerate; i++) {
      await generateDummyCustomer();
    }
    return `${totalToGenerate} customers generated successfully!`;
  }catch(err){
    return `Error: ||${err.message}|| occured in generating customers`;
  }
}


const generateDummyCustomer = async () => {
  const customerObject = {
    name: faker.name.firstName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email() ,
    password: '12345678',
    dob:faker.date.recent(),
    configuration: {
      isVerified: true,
      isBlocked: false,
    },
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
  const customer = new Customer(customerObject);
  await customer.save();
  return customer._id;
}


module.exports = {generateDummyCustomerData, generateDummyCustomer};