import { renderWelcomeEmail, getWelcomeSubject } from '../../emails/welcome';
import { renderInvoiceEmail, getInvoiceSubject } from '../../emails/invoice';

interface ResendEmailPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Simple placeholder for the Resend client
const resend = {
  emails: {
    send: async (payload: ResendEmailPayload) => payload,
  },
};

export async function sendWelcomeEmail(
  to: string,
  locale: string,
) {
  const html = renderWelcomeEmail(locale as any);
  const subject = getWelcomeSubject(locale as any);
  return resend.emails.send({
    from: 'no-reply@example.com',
    to,
    subject,
    html,
  });
}

export async function sendInvoiceEmail(
  to: string,
  locale: string,
  amount: number,
) {
  const html = renderInvoiceEmail(locale as any, amount);
  const subject = getInvoiceSubject(locale as any);
  return resend.emails.send({
    from: 'no-reply@example.com',
    to,
    subject,
    html,
  });
}

interface Tenant {
  language?: string;
}

export async function sendWelcomeEmailForTenant(
  to: string,
  tenant: Tenant,
) {
  const locale = tenant.language ?? 'en';
  return sendWelcomeEmail(to, locale);
}

export async function sendInvoiceEmailForTenant(
  to: string,
  amount: number,
  tenant: Tenant,
) {
  const locale = tenant.language ?? 'en';
  return sendInvoiceEmail(to, locale, amount);
}
