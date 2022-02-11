const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();


const sendTestEmail = (receiverEmail, mailSubject, mailBody) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiverEmail, // Change to your recipient
    from: process.env.SENDER_EMAIL, // Change to your verified sender
    subject: mailSubject,
    text: mailBody,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to ${receiverEmail}`);
    })
    .catch((error) => {
      console.error(error);
    });
};


const sendProductionEmail = (receiverEmail, mailSubject, mailBody) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });
  console.log(`Email initiated for ${receiverEmail}`);
  transporter.sendMail({
    from: "Ambher Technologies",
    to: receiverEmail,
    subject: mailSubject,
    text: mailBody,
  });
};


// making it a non promising function to avoid blocking the main thread.
const sendEmail = (receiverEmail, mailSubject, mailBody) => {
  switch (process.env.NODE_ENV) {
  case "production": {
    sendProductionEmail(receiverEmail, mailSubject, mailBody);
    break;
  }
  case "test": {
    sendTestEmail(receiverEmail, mailSubject, mailBody);
    break;
  }
  }
};

module.exports = { sendEmail };
