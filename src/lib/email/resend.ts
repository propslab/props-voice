import { Resend } from "resend";

// 送信元アドレス（Resend で検証済ドメインから送る）
// 未設定時は Resend のテストドメインへフォールバック（本番では必ず .env で上書き）
function fromAddress(): string {
  return process.env.RESEND_FROM ?? "Props Voice <onboarding@resend.dev>";
}

function dashboardUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/dashboard`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// メールヘッダ用フィールドから CR/LF を除去（store_name 由来のヘッダインジェクション防御）
function sanitizeHeader(s: string): string {
  return s.replace(/\r/g, " ").replace(/\n/g, " ").trim();
}

export type LowRatingAlertPayload = {
  to: string;
  storeName: string;
  rating: number;
  rawInput: string;
  polished: string;
};

// Standard プラン限定の低評価アラート。
// RESEND_API_KEY が未設定の場合は警告ログを出して no-op（polishDraft を止めない）。
export async function sendLowRatingAlert(
  payload: LowRatingAlertPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY 未設定のため低評価アラート送信をスキップ"
    );
    return;
  }

  const safeStoreName = sanitizeHeader(payload.storeName);
  const stars = "★".repeat(payload.rating) + "☆".repeat(5 - payload.rating);
  const subject = sanitizeHeader(
    `[Props Voice] ${safeStoreName} に ★${payload.rating} の口コミがありました`
  );

  const text = [
    `${safeStoreName} に低評価（${stars}）の口コミがありました。`,
    "",
    "■ お客様の原文",
    payload.rawInput,
    "",
    "■ 整文結果",
    payload.polished,
    "",
    `ダッシュボード: ${dashboardUrl()}`,
    "",
    "---",
    "Props Voice / Props Lab",
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Props Voice</p>
      <h1 style="font-size: 18px; font-weight: 700; margin: 0 0 16px; color: #111827;">
        ${escapeHtml(safeStoreName)} に低評価の口コミがありました
      </h1>
      <p style="font-size: 24px; color: #f59e0b; margin: 0 0 24px; letter-spacing: 2px;">${stars}</p>

      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 6px; font-weight: 600;">お客様の原文</p>
        <p style="font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(payload.rawInput)}</p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 6px; font-weight: 600;">整文結果</p>
        <p style="font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(payload.polished)}</p>
      </div>

      <p style="margin: 0 0 24px;">
        <a href="${dashboardUrl()}" style="display: inline-block; background: #1f2937; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">ダッシュボードを開く</a>
      </p>

      <p style="font-size: 11px; color: #9ca3af; margin: 0; border-top: 1px solid #e5e7eb; padding-top: 16px;">
        Props Voice / Props Lab<br />
        この通知は Standard プランの低評価アラート設定により送信されています。
      </p>
    </div>
  `.trim();

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: payload.to,
      subject,
      text,
      html,
    });
    if (error) {
      console.error("[email] Resend エラー:", error);
    }
  } catch (e) {
    console.error("[email] Resend 送信失敗:", e);
  }
}
