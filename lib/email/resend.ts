import { Resend } from 'resend';
import React from 'react';
import { isFeatureEnabled } from '../flags';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendEmail(options: {
  from: string;
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!isFeatureEnabled('email')) {
    console.log('Email feature disabled');
    return;
  }
  try {
    const data = await resend.emails.send(options);
    console.log('Email sent', data);
    return data;
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
}

export async function verifyDomain(domainId: string) {
  try {
    const data = await resend.domains.verify({ id: domainId });
    console.log('Domain verified', data);
    return data;
  } catch (error) {
    console.error('Domain verification failed', error);
    throw error;
  }
}

export default resend;
