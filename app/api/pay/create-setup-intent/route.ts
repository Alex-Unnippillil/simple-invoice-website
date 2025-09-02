import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  const { customerId } = await req.json();

  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: "off_session",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
