const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      passL: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: "khaled A.",
    to: options.email,
    subject: options.subject,
    text: options.text, 
  };

  await transporter.sendMail(options);
};

module.exports = sendEmail;
