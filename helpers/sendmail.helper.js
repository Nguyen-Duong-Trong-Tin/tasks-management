const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tin38618@gmail.com",
    pass: "broy xlao isdb sbxl",
  }
});

module.exports = (to, subject, html) => {
  const mailOptions = {
    from: "tin38618@gmail.com",
    to: to,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, (e, info) => {
    if (e) {
      console.log("Error: ", e);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}