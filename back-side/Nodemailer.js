const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email address from environment variable
    pass: process.env.EMAIL_PASS, // your email password or app-specific password from environment variable
  },
});

// Function to send an email
async function sendVerificationEmail(toEmail, otp, postRandomString) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: toEmail, // list of receivers
      subject: "Password Reset Verification", // Subject line
      html: `
        <b>Please use the following code to reset your password:</b>
        <h1>${otp}</h1>
        <b>Do not give this code to anyone</b>
        <br>
        <p>Please click the following link to reset your password:</p>
        <a href="http://localhost:3001/user/reset/password?token=${postRandomString}">
          Click Here To Reset Your Password
        </a>
      `, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: %s", error.message);
    throw error; // rethrow the error to be caught in the route handler
  }
}

module.exports = { sendVerificationEmail };
