const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: 'https://geric-choi.surge.sh',
  })
);

app.use(express.json());


const resend = new Resend(process.env.RESEND_API_KEY);


app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {

    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'mangaligericoaron@gmail.com',
      subject: `New message from ${name}`,
      html: `
        <strong>Name:</strong> ${name}<br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Message:</strong><br/>${message}
      `,
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Email sending failed' });
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
