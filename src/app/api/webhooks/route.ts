import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Simple webhook handler with mock signature verification
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature") || "";

  // In production:
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  // } catch (err) {
  //   return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  // }

  // Check signature if configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_placeholder";

  if (signature === "" && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No signature provided in production" }, { status: 401 });
  }

  // Handle the event
  // if (event.type === 'checkout.session.completed') {
  //   const session = event.data.object;
  //   // Save order to database or file
  // }

  console.log("Stripe Webhook received:", body.substring(0, 100) + "...");

  return NextResponse.json({ received: true });
}
