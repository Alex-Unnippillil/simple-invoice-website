'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { autopayEnabled, achEnabled } from '@/lib/flags';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PayPage() {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    if (!autopayEnabled) return;
    fetch('/api/pay').then(async (res) => {
      const data = await res.json();
      setClientSecret(data.clientSecret);
    });
  }, []);

  if (!autopayEnabled) {
    return null;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: 'stripe' },
    // Enable US bank account payments alongside cards
    paymentMethodOrder: achEnabled ? ['card', 'us_bank_account'] : ['card'],
  };

  return (
    <div className="max-w-md mx-auto">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentElement />
          {/* Required ACH mandate text for US bank account payments */}
          {achEnabled && (
            <p className="mt-4 text-xs text-gray-600" id="ach-mandate">
              By providing your bank account information and confirming this payment, you authorize
              our company and Stripe to debit your account. If necessary, Stripe may electronically
              credit your account to correct erroneous debits. You acknowledge that ACH payments are
              subject to U.S. banking laws and NACHA operating rules.
            </p>
          )}
        </Elements>
      )}
    </div>
  );
}

