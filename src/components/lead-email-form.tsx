"use client";

import { useState, useTransition } from "react";
import { subscribeStandardLead } from "@/lib/lead/actions";

export function LeadEmailForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await subscribeStandardLead(email);
      if (result.success) {
        setFeedback({
          type: "success",
          message: "登録ありがとうございます！公開時にお知らせします。",
        });
        setEmail("");
      } else {
        setFeedback({ type: "error", message: result.error });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isPending}
          className="flex-1 min-w-0 rounded-md border border-border px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending || !email}
          className="whitespace-nowrap rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "登録中..." : "通知を受け取る"}
        </button>
      </div>

      {feedback && (
        <p
          role="status"
          className={`text-xs ${
            feedback.type === "success" ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
