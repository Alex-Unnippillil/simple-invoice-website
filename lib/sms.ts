import Twilio from 'twilio';
import type { Request, Response } from 'express';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_FROM_NUMBER!;

const client = Twilio(accountSid, authToken);

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
      console.warn(`Message ${MessageSid} status: ${MessageStatus}`);
    }

    if (Body && /\bSTOP\b/i.test(Body)) {
      // TODO: flag tenant as opted out
      console.warn(`Phone ${From} opted out of SMS`);
    }

  res.type('text/xml');
  res.send('<Response></Response>');
}
