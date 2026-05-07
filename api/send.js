const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // 2. Transporter Setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 3. Send the Mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, 
      to: process.env.RECEIVER_EMAIL,
      subject: `Potential Client ${name}`,
      text: message,
      replyTo: email, // This lets you click "Reply" to message the user directly
    });

    return res.status(200).json({ success: true, message: 'Email sent!' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
