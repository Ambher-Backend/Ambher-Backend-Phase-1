require("../../spec_helper");

const request = require("supertest");
const expect = require("chai").expect;
const describe = require("mocha").describe;
const it = require("mocha").it;
const { before, beforeEach, after, afterEach } = require("mocha");


const BASE_URL = "/admin";


// Internal Imports
const app = require("../../../app");
const Admin = require("../../../src/models/admin");
const Vendor = require("../../../src/models/vendor");
const Customer = require("../../../src/models/customer");
const adminSeeder = require("../../../config/database/seeds/admin");
const vendorSeeder = require("../../../config/database/seeds/vendor");
const customerSeeder = require("../../../config/database/seeds/customer");
const responseCodes = require("../../../src/lib/constants").RESPONSE_CODES;


let testEmail = "";
let testPassword = "";


// Utility method to make POST REST Call to the server.
const postCaller = async (url, reqBody = {}) => {
  let callUrl = `${BASE_URL}${url}`;
  return await request(app).post(callUrl).send(reqBody);
};


// Utility method to make POST REST Call to the server.
const getCaller = async (url, reqBody = {}) => {
  let callUrl = `${BASE_URL}${url}`;
  return await request(app).get(callUrl).send(reqBody);
};

// Utility method to toggle the customer verification status
const toggleVerificationStatus = async (Model, filter, status) => {
  await Model.updateOne(
    filter,
    { $set: { "configuration.isVerified": status } }
  );
  return;
};

// Utility method to generate a admin and add auth token to it
const generateAndAuthenticateAdmin = async () => {
  const adminId = await adminSeeder.generateAndSaveDummyAdmin();
  const admin = await Admin.findById(adminId);
  const token = await admin.generateToken();
  return {
    token: token,
    adminId: adminId
  };
};


describe("Admin APIs", async () => {
  /*
  This `before` block hook will be executed before the starting of this test suite.
  Purpose of this block is to assigned values to those variables, which are going to be used all over the suite.
  */
  before(async () => {
    testEmail = "demoadmin@gmail.com";
    testPassword = "12345678";
  });

  describe("Admin Signup APIs", async () => {
    // This after block is triggered only once after the "Admin Signup APIs" test suite is complete.
    after(async () => {
      await Admin.deleteMany({});
    });

    describe("When params are valid", async () => {
      let response = {};
      // this is initializing the request body, sending request and storing response in a variable.
      beforeEach(async () => {
        const requestBody = adminSeeder.generateDummyAdminObject({"email": testEmail});
        response = await postCaller("/signup", requestBody);
      });

      it("admin is created", async () => {
        expect(response.status).to.eql(responseCodes.CREATED_CODE);
        expect(response.body.status).to.eql(responseCodes.CREATED_CODE);
        expect(response.body.message).to.eql("Admin Created");
        expect(response.body.data).to.eql(null);
      });
    });
  });

  describe("Admin Login APIs", async () => {
    // this block is creating a dummy customer in the db with supplied email.
    before(async () => {
      await adminSeeder.generateAndSaveDummyAdmin({"email": testEmail});
    });

    // this block is deleting dummy customers in the db for the "Customer Login APIs" test suite.
    after(async () => {
      await Admin.deleteMany({});
    });

    afterEach(async () => {
      await toggleVerificationStatus(Admin, {email: testEmail}, false);
    });

    describe("when Valid Request/Credentials", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {email: testEmail, password: testPassword};
        await toggleVerificationStatus(Admin, {email: testEmail}, true);
        response = await postCaller("/login", requestBody);
      });

      it("login is successful", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Admin Login Successful");
        expect(response.body.data.currentToken).to.not.equal(null);
      });
    });

    describe("Invalid Request/Credentials", async () => {
      describe(" when wrong email or password", async () => {
        let response = {};
        beforeEach(async () => {
          const requestBody = { email: testEmail, password: "abcd1234" };

          response = await postCaller("/login", requestBody);
        });

        it("login fails", async () => {
          expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
          expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
          expect(response.body.message).to.eql("Password Incorrect");
          expect(response.body.data).to.eql(null);
        });
      });

      describe("when admin is not verified", async () => {
        let response = {};
        beforeEach(async () => {
          const requestBody = {email: testEmail, password: testPassword};

          response = await postCaller("/login", requestBody);
        });

        it("login fails", async () => {
          expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
          expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
          expect(response.body.message).to.eql(
            "Admin Email needs to be verified"
          );
        });
      });
    });
  });

  describe("Admin Logout APIs", async () => {
    after(async () => {
      await Admin.deleteMany({});
    });

    describe("When user is not logged in", async () => {
      let response = {};

      beforeEach(async () => {
        const requestBody = {
          currentToken: "wrong-token"
        };
        response = await postCaller("/logout", requestBody);
      });

      it("auth error is raised", () => {
        expect(response.status).to.eql(responseCodes.UNAUTHORIZED_ERROR_CODE);
        expect(response.body.status).to.eql(responseCodes.UNAUTHORIZED_ERROR_CODE);
      });
    });

    describe("When user is logged in", async () => {
      let response = {};
      beforeEach(async () => {
        const adminId = await adminSeeder.generateAndSaveDummyAdmin();
        await toggleVerificationStatus(Admin, {_id: adminId}, true);
        const admin = await Admin.findById(adminId);
        const loginToken = await admin.generateToken();
        const requestBody = {
          currentToken: loginToken
        };

        response = await postCaller("/logout", requestBody);
      });

      it("user logs out successfully", () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Admin Logged out");
      });
    });
  });

  describe("Admin Get APIs", async () => {
    describe("When id is valid", async () => {
      let response = {};
      beforeEach(async () => {
        const adminId = await adminSeeder.generateAndSaveDummyAdmin();
        await toggleVerificationStatus(Admin, {_id: adminId}, true);
        const admin = await Admin.findById(adminId);
        const loginToken = await admin.generateToken();
        const params = {
          currentToken: loginToken,
          adminId: adminId
        };

        response = await getCaller("/", params);
      });

      it("return admin data", () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Success");
        expect(response.body.data._id).to.not.eql(null);
      });
    });

    describe("When id is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const adminId = await adminSeeder.generateAndSaveDummyAdmin();
        await toggleVerificationStatus(Admin, {_id: adminId}, true);
        const admin = await Admin.findById(adminId);
        const loginToken = await admin.generateToken();
        const params = {
          currentToken: loginToken,
          adminId: "500"
        };

        response = await getCaller("/", params);
      });

      it("return error", () => {
        expect(response.status).to.eql(responseCodes.ACCESS_ERROR_CODE);
        expect(response.body.status).to.eql(responseCodes.ACCESS_ERROR_CODE);
        expect(response.body.data).to.eql(null);
      });
    });
  });

  describe("Send Verification Email Customer APIs", async () => {
    after(async () => {
      await Admin.deleteMany({});
    });

    describe("When request email is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          adminEmail: "abc@gma.com"
        };

        response = await postCaller("/new-email-otp", requestBody);
      });

      it("returns 'admin not found' error", async () => {
        expect(response.status).to.eql(responseCodes.NOT_FOUND_ERROR_CODE);
        expect(response.body.status).to.eql(responseCodes.NOT_FOUND_ERROR_CODE);
        expect(response.body.message).to.eql("Invalid Email, Admin Not registered");
      });
    });

    describe("When request email is valid", async () => {
      let response = {};
      beforeEach(async () => {
        const adminId = await adminSeeder.generateAndSaveDummyAdmin();
        const admin = await Admin.findById(adminId);
        const requestBody = {
          adminEmail: admin.email
        };

        response = await postCaller("/new-email-otp", requestBody);
      });

      it("sends otp successfully", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Admin Email OTP sent successfully");
      });
    });
  });

  describe("Verify Email Otp Customer APIs", async () => {
    after(async () => {
      await Admin.deleteMany({});
    });

    describe("When request email is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          adminEmail: "abc@gma.com",
          otp: "654321"
        };

        response = await postCaller("/verify-email-otp", requestBody);
      });

      it("returns admin not found error", async () => {
        expect(response.status).to.eql(responseCodes.NOT_FOUND_ERROR_CODE);
        expect(response.body.status).to.eql(responseCodes.NOT_FOUND_ERROR_CODE);
        expect(response.body.message).to.eql("Invalid Email, Admin Not registered");
      });
    });

    describe("When otp is invalid", async () => {
      let response = {};
      beforeEach(async () => {
        const adminId = await adminSeeder.generateAndSaveDummyAdmin();
        const admin = await Admin.findById(adminId);
        admin.emailOtps = ["123456"];
        await admin.save();

        const requestBody = {
          adminEmail: admin.email,
          otp: "654321"
        };

        response = await postCaller("/verify-email-otp", requestBody);
      });

      it("returns invalid otp error", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Wrong Admin Email OTP");
      });
    });

    describe("When request email is valid", async () => {
      let response = {};
      beforeEach(async () => {
        const adminId = await adminSeeder.generateAndSaveDummyAdmin();
        const admin = await Admin.findById(adminId);
        admin.emailOtps = ["123456"];
        await admin.save();

        const requestBody = {
          adminEmail: admin.email,
          otp: "123456"
        };

        response = await postCaller("/verify-email-otp", requestBody);
      });

      it("verifies otp successfully", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Admin Email OTP verified successfully");
      });
    });
  });

  describe("Admin Vendor APIs", async () => {
    let adminId, adminAuthToken;
    let vendorIds = [];
    before(async () => {
      const generatedAdmin = await generateAndAuthenticateAdmin();
      adminId = generatedAdmin.adminId;
      adminAuthToken = generatedAdmin.token;
      let nVendors = 5;
      while (nVendors--){
        const generatedVendorId = await vendorSeeder.generateAndSaveDummyVendor({isVerified: false, adminId: adminId});
        vendorIds.push(generatedVendorId);
      }
    });

    after(async () => {
      await Admin.deleteMany({});
      await Vendor.deleteMany({});
    });

    describe("When list vendor API is called", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          currentToken: adminAuthToken,
          filter: {}
        };

        response = await postCaller("/vendors", requestBody);
      });

      it("lists vendors", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Vendor List");
        expect(Object.values(response.body.data)[0].objectArray.map(vendor => vendor._id)).to.eql(vendorIds.map(vendorId => vendorId.toString()));
      });
    });

    describe("When view vendor details API is called", async () => {
      let response = {};

      beforeEach(async () => {
        const requestBody = {
          currentToken: adminAuthToken,
          vendorId: vendorIds[0]
        };
        response = await getCaller("/vendor-details/", requestBody);
      });

      it("returns vendor details", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.data._id).to.eql(vendorIds[0].toString());
      });
    });

    describe("When verify vendor API is called", async () => {
      let requestBody = {};
      before(async () => {
        requestBody = {
          currentToken: adminAuthToken,
          vendorId: vendorIds[0]
        };
      });

      describe("When vendor email is not verified", async () => {
        let response = {};
        beforeEach(async () => {
          response = await postCaller("/verify-vendor", requestBody);
        });

        it("verifies otp successfully", async () => {
          expect(response.status).to.eql(responseCodes.ACCESS_ERROR_CODE);
          expect(response.body.status).to.eql(responseCodes.ACCESS_ERROR_CODE);
          expect(response.body.message).to.eql("Vendor needs to verify their email");
        });
      });

      describe("When vendor email is verified", async () => {
        let response = {};
        beforeEach(async () => {
          await toggleVerificationStatus(Vendor, {_id: vendorIds[0]}, true);
          response = await postCaller("/verify-vendor", requestBody);
        });

        afterEach(async () => {
          await toggleVerificationStatus(Vendor, {_id: vendorIds[0]}, false);
        });

        it("verifies otp successfully", async () => {
          const verifiedVendor = await Vendor.findById(vendorIds[0]);
          expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
          expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
          expect(verifiedVendor.verifiedBy).to.eql(adminId);
          expect(response.body.message).to.eql("Vendor Account Verified By Admin Successfully");
        });
      });
    });
  });

  describe("Admin Customer APIs", async () => {
    let adminAuthToken;
    let customerIds = [];
    before(async () => {
      const generatedAdmin = await generateAndAuthenticateAdmin();
      adminAuthToken = generatedAdmin.token;
      let nCustomers = 5;
      while (nCustomers--){
        const generatedCustomerId = await customerSeeder.generateAndSaveDummyCustomer({isVerified: false});
        customerIds.push(generatedCustomerId);
      }
    });

    after(async () => {
      await Admin.deleteMany({});
      await Customer.deleteMany({});
    });

    describe("When list customer API is called", async () => {
      let response = {};
      beforeEach(async () => {
        const requestBody = {
          currentToken: adminAuthToken,
          filter: {}
        };

        response = await postCaller("/customers", requestBody);
      });

      it("lists customers", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.message).to.eql("Customer List");
        expect(Object.values(response.body.data)[0].objectArray.map(customer => customer._id)).to.eql(customerIds.map(customerId => customerId.toString()));
      });
    });

    describe("When view customer details API is called", async () => {
      let response = {};

      beforeEach(async () => {
        const requestBody = {
          currentToken: adminAuthToken,
          customerId: customerIds[0]
        };
        response = await getCaller("/customer-details/", requestBody);
      });

      it("returns customer details", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.data._id).to.eql(customerIds[0].toString());
      });
    });

    describe("When customer search by email API is called", async () => {
      let response = {};
      let email;
      beforeEach(async () => {
        const dummy = await Customer.findById(customerIds[0]);
        email = dummy.email;
        const requestBody = {
          currentToken: adminAuthToken,
          customerEmail: email
        };
        response = await getCaller("/customer-search/", requestBody);
      });

      it("returns customer with that email", async () => {
        expect(response.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.status).to.eql(responseCodes.SUCCESS_CODE);
        expect(response.body.data._id).to.eql(customerIds[0].toString());
        expect(response.body.data.email).to.eql(email);

      });
    });

    describe("When customer search by email API is called but wrong email is sent", async () => {
      let response = {};
      let email;
      beforeEach(async () => {
        email = "carrot@gmail.com";
        const requestBody = {
          currentToken: adminAuthToken,
          customerEmail: email
        };
        response = await getCaller("/customer-search/", requestBody);
      });

      it("returns error", async () => {
        expect(response.status).to.eql(responseCodes.NOT_FOUND_ERROR_CODE);
        expect(response.body.status).to.eql(responseCodes.NOT_FOUND_ERROR_CODE);
        expect(response.body.data).to.eql(null);
      });

    });
  });
});
