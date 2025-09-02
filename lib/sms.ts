import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const fromNumber = process.env.TWILIO_FROM_NUMBER || '';
const isProd = process.env.NODE_ENV === 'production';

let client: any;

if (isProd) {
  // Defer Twilio import so dev environments don't need the package
  const Twilio = require('twilio');
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  client = Twilio(accountSid, authToken);
} else {
  const logDir = path.resolve('.dev');
  const logFile = path.join(logDir, 'sms.log');
  client = {
    messages: {
      /** Stub create simply appends the SMS to .dev/sms.log */
      async create({ to, from, body }: { to: string; from: string; body: string }) {
        await fs.promises.mkdir(logDir, { recursive: true });
        const line = `${new Date().toISOString()}|${to}|${from}|${body}\n`;
        await fs.promises.appendFile(logFile, line, 'utf8');
        return { sid: 'stubbed' };
      },
    },
  };
}

/** Send a rent due reminder SMS */
export async function sendDueMessage(to: string, link: string) {
  return client.messages.create({
    to,
    from: fromNumber,
    body: `Your rent is due. View your invoice at ${link}`,
  });
}

/** Send a rent overdue reminder SMS */
export async function sendOverdueMessage(to: string, link: string) {
  return client.messages.create({
    to,
    from: fromNumber,
    body: `Your rent is overdue. View your invoice at ${link}`,
  });
}

/** Handle Twilio delivery status and opt-out callbacks */
export async function handleWebhook(req: Request, res: Response) {
  const { MessageSid, MessageStatus, Body, From } = req.body;

  if (MessageSid && MessageStatus) {
    // TODO: update message status in database
    console.log(`Message ${MessageSid} status: ${MessageStatus}`);
  }

  if (Body && /\bSTOP\b/i.test(Body)) {
    // TODO: flag tenant as opted out
    console.log(`Phone ${From} opted out of SMS`);
  }

  res.type('text/xml');
  res.send('<Response></Response>');
}

