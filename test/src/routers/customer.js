const request = require("supertest");
const expect = require("chai").expect;
const describe = require("mocha").describe;
const it = require("mocha").it;
const { before, beforeEach, after, afterEach } = require("mocha");


const relativePath = "../../..";


// Internal Imports
const app = require(`${relativePath}/app`);
const Customer = require(`${relativePath}/src/models/customer`);
const customerSeeder = require(`${relativePath}/config/database/seeds/customer`);


let testEmail = "";
let testPassword = "";


const toggleVerificationStatus = async (filter, status) => {
  await Customer.updateOne(
    filter,
    { $set: { "configuration.isVerified": status } }
  );
  return;
};


describe("Customer APIs", async () => {
  // This hook will run only once before the test-suite starts
  before(async () => {
    testEmail = "democustomer@gmail.com";
    testPassword = "12345678";
  });

  describe("Customer Signup APIs", async () => {
    describe("When params are valid", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = customerSeeder.generateDummyCustomerObject({"email": testEmail});

        response = await request(app)
          .post("/customer/signup")
          .send(requestBody);
      });

      it("customer is created", async () => {
        expect(response.body.status).to.eql(201);
        expect(response.body.message).to.eql("Customer Created");
        expect(response.body.data).to.eql(null);
      });
    });
  });

  describe("Customer Login APIs", async () => {
    // This function is important because
    afterEach(async () => {
      await toggleVerificationStatus({email: testEmail}, false);
    });

    describe("when Valid Request/Credentials", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {email: testEmail, password: testPassword};
        await toggleVerificationStatus({email: testEmail}, true);

        response = await request(app).post("/customer/login").send(requestBody);
      });

      it("login is successful", async () => {
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql("Customer Login Successful");
        expect(response.body.data.currentToken).to.not.equal(null);
      });
    });

    describe("Invalid Request/Credentials", async () => {
      describe(" when wrong email or password", async () => {
        let response = {};
        beforeEach(async () => {
          const requestBody = { email: testEmail, password: "abcd1234" };

          response = await request(app)
            .post("/customer/login")
            .send(requestBody);
        });

        it("login fails", async () => {
          expect(response.body.status).to.eql(400);
          expect(response.body.message).to.eql("Password Incorrect");
          expect(response.body.data).to.eql(null);
        });
      });

      describe("when customer is not verified", async () => {
        let response = {};
        beforeEach(async () => {
          const requestBody = {email: testEmail, password: testPassword};

          response = await request(app)
            .post("/customer/login")
            .send(requestBody);
        });

        it("login fails", async () => {
          expect(response.body.status).to.eql(200);
          expect(response.body.message).to.eql(
            "Customer Email needs to be verified"
          );
        });
      });
    });
  });

  describe("Customer Logout APIs", async () => {
    describe("When user is not logged in", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          currentToken: "wrong-token"
        };

        response = await request(app)
          .post("/customer/logout")
          .send(requestBody);
      });

      it("auth error is raised", () => {
        expect(response.body.status).to.eql(401);
      });
    });

    describe("When user is logged in", async () => {
      let response = {};
      beforeEach(async () => {
        const customerId = await customerSeeder.generateAndSaveDummyCustomer();
        await toggleVerificationStatus({_id: customerId}, true);
        const customer = await Customer.findById(customerId);
        const loginToken = await customer.generateToken();
        const requestBody = {
          currentToken: loginToken
        };

        response = await request(app)
          .post("/customer/logout")
          .send(requestBody);
      });

      it("user logs out successfully", () => {
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql("Customer Logged out");
      });
    });
  });

  describe("Customer Get APIs", async () => {
    describe("When id is valid", async () => {
      let response = {};
      beforeEach(async () => {
        const customerId = await customerSeeder.generateAndSaveDummyCustomer();
        await toggleVerificationStatus({_id: customerId}, true);
        const customer = await Customer.findById(customerId);
        const loginToken = await customer.generateToken();
        const requestBody = {
          currentToken: loginToken
        };

        response = await request(app)
          .get("/customer/" + customerId)
          .send(requestBody);
      });

      it("return customer data", () => {
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql("Success");
        expect(response.body.data._id).to.not.eql(null);
      });
    });

    describe("When id is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const customerId = await customerSeeder.generateAndSaveDummyCustomer();
        await toggleVerificationStatus({_id: customerId}, true);
        const customer = await Customer.findById(customerId);
        const loginToken = await customer.generateToken();
        const requestBody = {
          currentToken: loginToken
        };

        response = await request(app)
          .get("/customer/" + "12345")
          .send(requestBody);
      });

      it("return customer data", () => {
        expect(response.body.status).to.eql(400);
        expect(response.body.data).to.eql(null);
      });
    });
  });

  describe("Send Verification Email Customer APIs", async () => {
    describe("When request email is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          customerEmail: "abc@gma.com"
        };

        response = await request(app)
          .post("/customer/new-email-otp")
          .send(requestBody);
      });

      it("returns 'customer not found' error", async () => {
        expect(response.body.status).to.eql(400);
        expect(response.body.message).to.eql("Invalid Customer Email, Customer not found");
      });
    });

    describe("When request email is valid", async () => {
      let response = {};
      beforeEach(async () => {
        const customerId = await customerSeeder.generateAndSaveDummyCustomer();
        const customer = await Customer.findById(customerId);
        const requestBody = {
          customerEmail: customer.email
        };

        response = await request(app)
          .post("/customer/new-email-otp")
          .send(requestBody);
      });

      it("sends otp successfully", async () => {
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql("Customer Email OTP sent successfully");
      });
    });
  });

  describe("Verify Email Otp Customer APIs", async () => {
    describe("When request email is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          customerEmail: "abc@gma.com",
          otp: "654321"
        };

        response = await request(app)
          .post("/customer/verify-email-otp")
          .send(requestBody);
      });

      it("returns customer not found error", async () => {
        expect(response.body.status).to.eql(400);
        expect(response.body.message).to.eql("Invalid Customer Email, Customer not found");
      });
    });

    describe("When otp is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const customerId = await customerSeeder.generateAndSaveDummyCustomer();
        const customer = await Customer.findById(customerId);
        customer.emailOtps = ["123456"];
        await customer.save();

        const requestBody = {
          customerEmail: customer.email,
          otp: "654321"
        };

        response = await request(app)
          .post("/customer/verify-email-otp")
          .send(requestBody);
      });

      it("returns invalid opt error", async () => {
        expect(response.body.status).to.eql(400);
        expect(response.body.message).to.eql("Wrong Customer Email OTP");
      });
    });

    describe("When request email is valid", async () => {
      let response = {};
      beforeEach(async () => {
        const customerId = await customerSeeder.generateAndSaveDummyCustomer();
        const customer = await Customer.findById(customerId);
        customer.emailOtps = ["123456"];
        await customer.save();

        const requestBody = {
          customerEmail: customer.email,
          otp: "123456"
        };

        response = await request(app)
          .post("/customer/verify-email-otp")
          .send(requestBody);
      });

      it("sends otp successfully", async () => {
        expect(response.body.status).to.eql(200);
        expect(response.body.message).to.eql("Customer OTP verified successfully");
      });
    });
  });

  // This hook will run only once after the test-suite ends for clean-up and other purposes.
  after(async () => {
    await Customer.deleteMany({});
  });
});
