const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const options = {
    from: "khaled A.",
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
  };

  await transport.sendMail(options);
};

module.exports = sendEmail;
