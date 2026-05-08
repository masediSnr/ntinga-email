const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // 1. Handle CORS Headers
  // Replace '*' with 'https://yourdomain.co.za' for better security
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle Preflight (OPTIONS) request
  // Browsers send this before the actual POST request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Only allow POST for the actual email logic
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // 2. Transporter Setup
  const transporter = nodemailer.createTransport({
        host: 'mail.ntingatechnologies.co.za', // HostAfrica usually uses mail.yourdomain
        port: 465,                             // SSL Port
        secure: true,                          // Required for 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,        // Your Roundcube/Email password
        },
        // HostAfrica servers sometimes require this for local certificates
        tls: {
            rejectUnauthorized: false 
        }
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
