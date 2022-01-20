const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// sync function in order to not stop the process
const sendEmail = (ReceiverEmail, mailSubject, mailBody) => {
  const transporter = nodemailer.createTransport ({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    }
  });

  const response = transporter.sendMail({
    from: "Ambher Technologies",
    to: ReceiverEmail,
    subject: mailSubject,
    text: mailBody
  });
};

module.exports = {sendEmail};