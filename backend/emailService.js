/* // controllers/emailController.js
const axios = require('axios');

const sendEmail = async (req, res) => {
  const { address, subject, message, supervisorEmail } = req.body;

  try {
    const response = await axios.post(
      'https://api.mailersend.com/v1/email',
      {
        from: {
          email: 'trial-3zxk54v993xgjy6v.mlsender.net',
          name: 'Mernstackapp'
        },
        to: [
          {
            email: address,
            name: 'Recipient'
          }
        ],
        cc: [
          {
            email: supervisorEmail,
            name: 'Supervisor'
          }
        ],
        subject: subject,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer mlsn.eff3244d312e37dee195761571a194c820f86720633d9447d80e6aa9a82aa280`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ message: 'Email sent successfully!', data: response.data });
  } catch (error) {
    console.error('MailerSend Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendEmail }; */
