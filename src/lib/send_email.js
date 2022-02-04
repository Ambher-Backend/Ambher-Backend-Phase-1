const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// making it a non promising function to avoid blocking the main thread.
const sendEmail = (receiverEmail, mailSubject, mailBody) => {
  if (process.env.NODE_ENV === "production"){
    return;
  }
  const transporter = nodemailer.createTransport ({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    }
  });

  console.log(`Email initiated for ${receiverEmail}`);
  transporter.sendMail({
    from: "Ambher Technologies",
    to: receiverEmail,
    subject: mailSubject,
    text: mailBody
  });
};

module.exports = {sendEmail};