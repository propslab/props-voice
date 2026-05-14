"use client";

import { useState, useTransition } from "react";
import { requestEmailOtp, verifyEmailOtp } from "@/lib/auth/actions";

type Mode = "login" | "signup";
type Step = "email" | "code";

const COPY: Record<
  Mode,
  { sendButton: string; sendingButton: string; verifyButton: string }
> = {
  login: {
    sendButton: "ログインコードを送信",
    sendingButton: "送信中...",
    verifyButton: "ログイン",
  },
  signup: {
    sendButton: "確認コードを送信",
    sendingButton: "送信中...",
    verifyButton: "アカウント作成",
  },
};

export function LoginForm({ mode = "login" }: { mode?: Mode }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);

  const copy = COPY[mode];

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await requestEmailOtp(email);
      if (result.success) {
        setFeedback({
          type: "success",
          message: result.message ?? "コードを送信しました",
        });
        setStep("code");
      } else {
        setFeedback({ type: "error", message: result.error });
      }
    });
  };

  const handleCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await verifyEmailOtp(email, code);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error });
      }
    });
  };

  const resetToEmailStep = () => {
    setStep("email");
    setCode("");
    setFeedback(null);
  };

  if (step === "code") {
    return (
      <form onSubmit={handleCodeSubmit} className="space-y-5" noValidate>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <span className="font-medium">{email}</span> 宛に8桁のコードを送信しました。
        </div>

        <div className="space-y-2">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-foreground"
          >
            確認コード
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 8))
            }
            disabled={isPending}
            placeholder="12345678"
            autoFocus
            className="w-full rounded-md border border-border px-3 py-2.5 text-center text-2xl font-mono tracking-[0.3em] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            メール本文に記載の数字（6〜8桁）を入力してください。届かない場合は迷惑メールフォルダもご確認ください。
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || code.length < 6}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-base font-medium text-brand-foreground transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "確認中..." : copy.verifyButton}
        </button>

        {feedback?.type === "error" && (
          <div
            role="alert"
            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
          >
            {feedback.message}
          </div>
        )}

        <button
          type="button"
          onClick={resetToEmailStep}
          disabled={isPending}
          className="block w-full text-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          メールアドレスを変更する
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isPending}
          placeholder="you@example.com"
          className="w-full rounded-md border border-border px-3 py-2.5 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !email}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-base font-medium text-brand-foreground transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? copy.sendingButton : copy.sendButton}
      </button>

      {feedback && (
        <div
          role="status"
          className={`rounded-md border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        パスワードは不要です。届いたメールに記載された6桁のコードを次の画面で入力してください。
      </p>
    </form>
  );
}
