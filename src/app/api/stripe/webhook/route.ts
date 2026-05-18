import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET が未設定");
    return NextResponse.json(
      { error: "Webhook secret 未設定" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "stripe-signature ヘッダーがありません" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] 署名検証エラー:", err);
    return NextResponse.json(
      { error: "署名検証に失敗しました" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (
          session.mode === "subscription" &&
          session.customer &&
          session.subscription
        ) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id;
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const { error } = await supabase
            .from("profiles")
            .update({
              plan: "standard",
              stripe_subscription_id: subscriptionId,
              plan_updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error(
              "[stripe/webhook] checkout.session.completed 更新エラー:",
              error
            );
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        const { error } = await supabase
          .from("profiles")
          .update({
            plan: isActive ? "standard" : "free",
            plan_updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error(
            "[stripe/webhook] subscription.updated 更新エラー:",
            error
          );
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.paused": {
        const subscription = event.data.object;
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "free",
            plan_updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error(
            "[stripe/webhook] subscription.deleted/paused 更新エラー:",
            error
          );
        }
        break;
      }

      default:
        // 未対応イベントは無視
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] ハンドラエラー:", err);
    return NextResponse.json(
      { error: "Webhook 処理に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
