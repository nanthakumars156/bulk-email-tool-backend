// backend/routes/emailRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");
const Email = require("../models/Email");

const router = express.Router();

router.post("/send", async (req, res) => {
  const { recipientList, subject, body } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailPromises = recipientList.map((recipient) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: body,
    };

    return transporter.sendMail(mailOptions)
      .then(() => {
        const emailLog = new Email({ recipient, subject, body, status: "sent" });
        emailLog.save();
      })
      .catch(() => {
        const emailLog = new Email({ recipient, subject, body, status: "failed" });
        emailLog.save();
      });
  });

  await Promise.all(emailPromises);
  res.status(200).json({ message: "Emails sent" });
});

module.exports = router;
