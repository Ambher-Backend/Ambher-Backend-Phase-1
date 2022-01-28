const request = require('supertest');
const path = require('path');
const expect = require("chai").expect;
const faker = require('faker');
const Vendor = require('../src/models/vendor');

const app = require('../app');




describe('Testing vendor router', () => {

    let Token;
    let vendorId;
    let email = "vendor@gmail.com";
    let password = 'vendor@123';


    describe('Vendor signup', () => {

            it('makes a vendor when perfect credentials are given', async () => {
                const reqBody ={
                    name: faker.name.firstName(),
                    phoneNumber: '9876550424',
                    email: email ,
                    password: password,
                    dob:faker.date.recent(),
                    configuration: {
                      isVerified: true,
                      isBlocked: false,
                      isVerifiedByAdmin: true
                    },
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
                const response = await request(app).post('/vendor/signup').send(reqBody);
                expect(response.body.status).to.eql(201);
                expect(response.body.message).to.eql('Vendor Created');
                expect(response.body.data).to.eql(null);
            });


            it('returns error when two accounts with the same email are created', async () => {
                const reqBodyVendor = {
                    name: faker.name.firstName(),
                    phoneNumber: '9876550426',
                    email: faker.internet.email() ,
                    password: "12345678",
                    dob:faker.date.recent(),
                    configuration: {
                      isVerified: true,
                      isVerifiedByAdmin: true,
                      isBlocked: false
                    },
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
                    ]};
                const response1 = await request(app).post('/vendor/signup').send(reqBodyVendor);
                let reqDemoVendorDup = reqBodyVendor;
                reqDemoVendorDup.phoneNumber = "1234567890";
                const response2 = await request(app).post('/vendor/signup').send(reqDemoVendorDup);
                expect(response1.body.status).to.eql(201);
                expect(response1.body.message).to.eql('Vendor Created');
                expect(response2.body.status).to.eq(400);
            });
    });


    describe("Vendor login", () => {

      
            it('vendor should get logged in when credentials are good', async () => {
                const reqBodyVendor = {email: email, password: password};
                const response = await request(app).post('/vendor/login').send(reqBodyVendor);
                expect(response.body.status).to.eql(200);
                expect(response.body.data).to.not.eql(null);
                expect(response.body.data.currentToken).to.not.equal(null);
                Token = response.body.data.currentToken;
                vendorId = response.body.data._id;

            });

            it('Vendor does not get logged in when credentials are wrong', async () => {
                const reqBodyVendor = {email: faker.internet.email(), password: password};
                const response = await request(app).post('/vendor/login').send(reqBodyVendor);
                expect(response.body.status).to.eql(400);
                expect(response.body.data).to.eql(null);
            });

    });
        
    describe('Vendor get by Id', () => {

        it("should get vendor with correct token and Id", async () => {
            const reqBodyVendor = {
                currentToken: Token
            };
            const response = await request(app).get(`/vendor/${vendorId}`).send(reqBodyVendor);

            expect(response.body.status).to.eql(200);
            expect(response.body.message).to.eql("Success");
        });

    });

    describe("Vendor logout", () => {
      
      it("Vendor should get logged out with right token", async () => {
        const reqBody = {
            currentToken: Token
        };
        const response = await request(app).post(`/vendor/logout`).send(reqBody);
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql("Vendor Logged out");
    });

    
     it("Vendor documents deleted", async () => {
         await Vendor.deleteMany({});
     })

    });


    
});
