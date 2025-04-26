const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  const { recipient, messageBody } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jinuka.markperera@gmail.com', // sender email
      pass: 'nhpeppnswljqogbp', // App password from Gmail
    },
  });

  const mailOptions = {
    from: 'jinuk.markperera@gmail.com',
    to: recipient,
    subject: 'Assigned delivery',
    text: messageBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
};

module.exports = { sendEmail };
