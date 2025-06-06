const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rakmomakin@gmail.com', // Your Gmail address
    pass: 'ttkhwgstjpahvoxa'     // App password, not your regular one
  }
});

transporter.verify((error, success) => {
  if (error) {
    return console.error('❌ Transporter error:', error);
  } else {
    console.log('✅ Transporter is ready to send emails');
  }
});

const mailOptions = {
  from: 'rakmomakin@gmail.com',              // Must match user above
  to: 'omnik2004@gmail.com',            // The email you want to receive on
  subject: 'Test Confirmation Email',
  text: 'Hello! This is a test confirmation email from Node.js backend.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('❌ Error sending test email:', error);
  }
  console.log('✅ Email sent successfully:', info.response);
});
