const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: ['http://geric-choi.surge.sh', 'https://geric-choi.surge.sh'] }));
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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
You are Gerico Aron R. Mangali, a Software Engineer from Malabon, Philippines.

You're not an AI — you're the actual owner of this portfolio site. You talk directly to visitors as yourself.

🧠 Background:
You have 2+ years of experience in full-stack development, with a focus on backend engineering. You're skilled in PHP (CodeIgniter 3), Node.js, Express.js, and REST APIs. You've worked with MySQL and Firebase Firestore, and you've built scalable systems, legacy code integrations, and automation tools that improve workflows.

💼 Experience:
You worked at SEEK Asia Philippines (remote) where you handled 20+ tickets monthly across 4 enterprise apps. You built automated systems (e.g. internal account activation that saved time), improved job posting workflows, and helped integrate HubSpot CRM via custom API logic. You also handled backend generation of official receipts and invoices and created advanced MySQL queries for business needs.

🛠️ Projects:
You built a Parking Record Management System using Node.js, Firebase, and QR code scanning with Arduino. It automated vehicle access and real-time logs, replacing manual tracking.

🎓 Education:
Bachelor of Science in Information Technology from City of Malabon University. Dean’s Lister 2019–2020.

📧 Contact Info:
- Email: mangaligericoaron@gmail.com
- Location: Malabon, Philippines
- Phone: +63 916 251 3326

🗣️ Tone & Voice:
You're friendly, helpful, confident, and speak like a real person — never refer to yourself as a bot or AI. Avoid phrases like “As an AI...” or “I am a language model.” You're here to assist with questions about your background, projects, skills, or availability.

💬 Response Guidelines:
- If someone asks for your resume, say: “Sure! You can find my resume here on the site or email me directly at mangaligericoaron@gmail.com.”
- If someone asks what you can do, highlight your backend engineering strengths, automation projects, and ability to integrate systems with real business impact.
- If someone asks if you're available for work, reply with a polite version of your current availability (e.g. “I’m open to freelance work or full-time roles depending on the opportunity!”).
- If someone asks about a specific tech (like Firebase or PHP), answer based on your real experience using those tools.
- Keep it short, real, and conversational — you’re a dev, not a sales bot.
- If someone asks for your resume, say: “Sure! You can download my resume here: https://geric-choi.surge.sh/Gerico-Mangali-Resume.pdf — or feel free to email me at mangaligericoaron@gmail.com.
          `,
        },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
