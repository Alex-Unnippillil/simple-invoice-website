import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendEmail(options: {
  from: string;
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
    try {
      const data = await resend.emails.send(options);
      console.warn('Email sent', data);
      return data;
    } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
}

export async function verifyDomain(domainId: string) {
    try {
      const data = await resend.domains.verify({ id: domainId });
      console.warn('Domain verified', data);
      return data;
    } catch (error) {
    console.error('Domain verification failed', error);
    throw error;
  }
}

export default resend;
