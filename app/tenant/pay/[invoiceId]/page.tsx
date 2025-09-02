"use client";

import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type Invoice = {
  id: number;
  amount: number;
  description: string;
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: typeof window !== "undefined" ? window.location.href : "",
      },
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements}>Pay now</button>
      {message && <div>{message}</div>}
    </form>
  );
}

export default function Page({ params }: { params: { invoiceId: string } }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch(`/api/invoices/${params.invoiceId}`)
      .then((res) => res.json())
      .then((data) => setInvoice(data));
    fetch(`/api/invoices/${params.invoiceId}/create-payment-intent`)
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [params.invoiceId]);

  if (!clientSecret || !invoice) {
    return <div>Loading...</div>;
  }

  const options: StripeElementsOptions = {
    clientSecret,
  };

  return (
    <div>
      <h1>Pay Invoice #{invoice.id}</h1>
      <p>
        {invoice.description} - ${(invoice.amount / 100).toFixed(2)}
      </p>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

// Test card flows: use card number 4242 4242 4242 4242 with any future expiry date and CVC.
