import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, STRIPE_STANDARD_PRICE_ID } from "@/lib/stripe/server";

export async function POST() {
  if (!STRIPE_STANDARD_PRICE_ID) {
    console.error("[stripe/checkout] STRIPE_STANDARD_PRICE_ID が未設定");
    return NextResponse.json(
      { error: "決済設定エラー。運営者までお問い合わせください。" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("[stripe/checkout] profile 取得エラー:", profileError);
    return NextResponse.json(
      { error: "プロフィール取得に失敗しました" },
      { status: 500 }
    );
  }

  if (profile.plan === "standard") {
    return NextResponse.json(
      { error: "既に Standard プランをご利用中です" },
      { status: 400 }
    );
  }

  let customerId = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);

    if (updateError) {
      console.error(
        "[stripe/checkout] stripe_customer_id 保存エラー:",
        updateError
      );
    }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_STANDARD_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/settings?upgrade=success`,
    cancel_url: `${appUrl}/settings?upgrade=canceled`,
    locale: "ja",
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { user_id: user.id },
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
