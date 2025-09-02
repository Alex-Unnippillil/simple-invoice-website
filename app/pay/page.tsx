'use client';

import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<'ready' | 'processing' | 'success' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setStatus('processing');
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }
    let intent;
    do {
      const result = await stripe.retrievePaymentIntent(clientSecret);
      intent = result.paymentIntent;
      if (intent && (intent.status === 'succeeded' || intent.status === 'requires_payment_method')) break;
      await new Promise((r) => setTimeout(r, 1000));
    } while (true);
    if (intent?.status === 'succeeded') {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(intent?.last_payment_error?.message);
    }
  };

  if (status === 'success') {
    return <div>Payment successful. Thank you!</div>;
  }
  if (status === 'error') {
    return <div>Payment failed: {errorMessage}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || status === 'processing'}>
        {status === 'processing' ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
}

export default function PayPage() {
  const rent = 1200 * 100;
  const fees = Math.round(rent * 0.029 + 30);
  const total = rent + fees;
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pay/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [total]);

  return (
    <div>
      <h1>Pay Rent</h1>
      <p>Rent: ${(rent / 100).toFixed(2)}</p>
      <p>Processing Fees: ${(fees / 100).toFixed(2)}</p>
      <p>Total: ${(total / 100).toFixed(2)}</p>
      {clientSecret && (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
