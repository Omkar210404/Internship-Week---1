const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'usergmail.com',
    pass: 'userpassword',
  },
});

app.post('/api/book', (req, res) => {
  console.log('Received booking data:', req.body);

  const booking = req.body;

  if (!booking.email) {
    console.log('Error: No email provided in booking data!');
    return res.status(400).json({ error: 'Email is required!' });
  }

  fs.readFile('bookings.json', (err, data) => {
    if (err) {
      console.error('Error reading bookings.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let bookings = [];
    try {
      bookings = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing bookings.json:', parseErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    bookings.push(booking);

    fs.writeFile('bookings.json', JSON.stringify(bookings, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing to bookings.json:', writeErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Booking saved successfully:', booking);

      const mailOptions = {
        from: 'usergmail',
        to: booking.email,
        subject: '✅ Your Booking is Confirmed!',
        text: `
Hello ${booking.name || 'Guest'}, 👋

🎉 We are excited to confirm your booking! Here are your details:

📅 Date: ${booking.date || 'N/A'}
⏰ Time: ${booking.time || 'N/A'}
🏠 Room: ${booking.room || 'N/A'}

Thank you for choosing us! 🙏  
We look forward to serving you.

If you have any questions or need to make changes, feel free to reply to this email.

Warm regards,  
SISPL Room Booking Team 🏢
        `
      };

      transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
          console.error('Error sending confirmation email:', mailErr);
          return res.status(500).json({ error: 'Failed to send confirmation email' });
        }
        console.log('Confirmation email sent:', info.response);
        res.json({ message: 'Booking confirmed and email sent!' });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
