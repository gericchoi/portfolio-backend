// Import necessary modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Initialize Resend API with your API key from the .env file
const resend = new Resend(process.env.RESEND_API_KEY);

// POST endpoint to handle contact form submissions
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'mangaligericoaron@gmail.com', // Replace this with your actual email
      subject: `New message from ${name}`,
      html: `
        <strong>Name:</strong> ${name}<br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Message:</strong><br/>${message}
      `,
    });

    // Respond with success message
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    // Respond with error message
    res.status(500).json({ success: false, error: 'Email sending failed' });
  }
});

// Start the server
app.listen(port, () => console.log(`Backend running on port ${port}`));
