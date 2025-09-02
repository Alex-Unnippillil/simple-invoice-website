import { stripe } from "../../../lib/stripe";

export default async function PaymentMethodsPage() {
  const customerId = process.env.STRIPE_CUSTOMER_ID || "";
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Saved payment methods</h1>
      <ul className="list-disc pl-6">
        {paymentMethods.data.map((pm) => (
          <li key={pm.id}>
            {pm.card?.brand} ending in {pm.card?.last4}
          </li>
        ))}
      </ul>
    </div>
  );
}
