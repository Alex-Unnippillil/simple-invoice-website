'use client';

import { useEffect } from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';
import { recordLinkUsage, getLastLinkEmail } from '../../lib/analytics';

export default function PayPage() {
  const email = getLastLinkEmail() || '';

  useEffect(() => {
    if (email) {
      recordLinkUsage(email);
    }
  }, [email]);

  return (
    <form>
      <PaymentElement
        id="payment-element"
        options={{
          wallets: { applePay: 'auto', googlePay: 'auto', link: 'auto' },
          defaultValues: { billingDetails: { email } }
        }}
      />
    </form>
  );
}
