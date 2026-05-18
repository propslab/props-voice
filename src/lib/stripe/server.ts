import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY が設定されていません");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const STRIPE_STANDARD_PRICE_ID = process.env.STRIPE_STANDARD_PRICE_ID;
