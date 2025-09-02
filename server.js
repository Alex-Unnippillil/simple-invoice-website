import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import React from 'react';
import { render } from '@react-email/render';
import TestEmail from './emails/TestEmail.js';

dotenv.config();

const app = express();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

app.get('/api/test-email', async (req, res) => {
  if (!resend) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }
  try {
    const html = render(React.createElement(TestEmail));
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['test@example.com'],
      subject: 'Test email',
      html,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
