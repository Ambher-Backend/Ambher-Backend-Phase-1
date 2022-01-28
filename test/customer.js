process.env.NODE_ENV = 'test'


const faker = require('faker');
const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const Customer = require('../src/models/customer');
const app = require('../app');


describe('Customer APIs', () => {
    let currentToken;
    let id;
    let email = "demouser5@gmail.com";
    let password = '12345678';


    describe('Customer Authentiation', () => {


        it('Creating Customer', async () => {
            const reqBody = {
                name: faker.name.firstName(),
                phoneNumber: "8545413549",
                email: email,
                password: password,
                dob: faker.date.recent(),
            };

            const response = await request(app).post('/customer/signup').send(reqBody);

            console.error(response.body)
            expect(response.body.status).to.eql(201);
            expect(response.body.message).to.eql('Customer Created');
            expect(response.body.data).to.eql(null);
        });


        it("Login Customer", async () => {
            const reqBody = {
                email: email,
                password: password
            };
            const response = await request(app).post('/customer/login').send(reqBody);
            console.error(response.body)

            expect(response.body.status).to.eql(200);
            expect(response.body.message).to.eql("Customer Login Successful");
            expect(response.body.data.email).to.eql(email);
            expect(response.body.data.currentToken).to.not.equal(null);

            currentToken = response.body.data.currentToken;
            id = response.body.data._id;
        });


        it("Get Customer", async () => {
            const reqBody = {
                currentToken: currentToken
            };
            const response = await request(app).get(`/customer/${id}`).send(reqBody);

            expect(response.body.status).to.eql(200);
            expect(response.body.message).to.eql("Success");
        });


        it("Customer Logout", async () => {
            const reqBody = {
                currentToken: currentToken
            };
            const response = await request(app).post(`/customer/logout`).send(reqBody);
            expect(response.body.status).to.eql(200);
            expect(response.body.message).to.eql("Customer Logged out");
        });
         it("Deleting All Test Customer", async () => {
             await Customer.deleteMany({});
         })
    });
});
