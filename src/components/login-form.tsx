"use client";

import { useState, useTransition } from "react";
import { signInWithMagicLink } from "@/lib/auth/actions";

type Mode = "login" | "signup";

const COPY: Record<Mode, { submit: string; submitPending: string }> = {
  login: { submit: "メールでログイン", submitPending: "送信中..." },
  signup: { submit: "メールでアカウント作成", submitPending: "送信中..." },
};

export function LoginForm({ mode = "login" }: { mode?: Mode }) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);

  const copy = COPY[mode];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await signInWithMagicLink(email);
      if (result.success) {
        setFeedback({
          type: "success",
          message: result.message ?? "メールを送信しました。",
        });
        setEmail("");
      } else {
        setFeedback({ type: "error", message: result.error });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
        className="w-full rounded-md bg-brand px-4 py-2.5 text-base font-medium text-brand-foreground transition-colors hover:bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? copy.submitPending : copy.submit}
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
        パスワードは不要です。届いたメールのリンクをクリックすると{mode === "signup" ? "登録" : "ログイン"}が完了します。
      </p>
    </form>
  );
}
