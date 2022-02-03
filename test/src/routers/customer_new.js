const faker = require("faker");
const request = require("supertest");
const expect = require("chai").expect;

const relativePath = '../../..'

// Internal Imports
const Customer = require(`${relativePath}/src/models/customer`);
const customerSeeder = require(`${relativePath}/config/database/seeds/customer`);
const app = require(`${relativePath}/app`);


let testEmail = ''
let testPassword = ''


describe("Customer APIs", async () => {
  // This hook will run only once before the test-suite starts
  before(async () => {
    testEmail = 'democustomer@gmail.com';
    testPassword = '12345678';
  })

  describe("Customer Signup", async () => {
    describe('When params are valid', async () => {
      let response = {}
      beforeEach(async () => {
        const requestBody = {
          name: faker.name.firstName(),
          phoneNumber: '9789784512',
          email: testEmail,
          password: testPassword,
          dob: faker.date.recent()
        };

        response = await request(app).post('/customer/signup').send(requestBody);
      })

      it('creates customer', async () => {
        expect(response.body.status).to.eql(201);
        expect(response.body.message).to.eql('Customer Created');
        expect(response.body.data).to.eql(null);
      })
    })
  })

  describe('Customer Login', async () => {
    // This function is important because
    afterEach(async () => {
      await Customer.updateOne({email: testEmail}, {$set: {'configuration.isVerified': false}});
    })

    describe('Valid Request/Credentials', async () => {
      let response = {}
      beforeEach(async () => {
        const requestBody = {email: testEmail, password: testPassword}
        await Customer.updateOne({email: testEmail}, {$set: {'configuration.isVerified': true}});

        response = await request(app).post('/customer/login').send(requestBody);
      })

      it('successfully logs in', async () => {
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql('Customer Login Successful');
        expect(response.body.data.currentToken).to.not.equal(null);
      })
    });

    describe('Invalid Request/Credentials', async () => {
      describe('Wrong email or password', async () => {
        let response = {}
        beforeEach(async () => {
          const requestBody = {email: testEmail, password: 'abcd1234'}
  
          response = await request(app).post('/customer/login').send(requestBody);
        })
  
        it('login fails', async () => {
          expect(response.body.status).to.eql(400);
          expect(response.body.message).to.eql('Password Incorrect');
          expect(response.body.data).to.eql(null);
        })
      });

      describe('customer is not verified', async () => {
        let response = {}
        beforeEach(async () => {
          const requestBody = {email: testEmail, password: testPassword}
  
          response = await request(app).post('/customer/login').send(requestBody);
        })
  
        it('login fails', async () => {
          expect(response.body.status).to.eql(200);
          expect(response.body.message).to.eql('Customer Email needs to be verified');
        })
      });
    });
  })

  // This hook will run only after the complete test-suite ends
  after(async () => {
    await Customer.deleteMany({});
  })
})