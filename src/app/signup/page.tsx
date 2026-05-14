import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "アカウント作成｜Props Voice",
};

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-muted/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
          >
            Props Lab
          </Link>
          <h1 className="text-2xl font-bold text-brand">無料で Props Voice を始める</h1>
          <p className="text-sm text-muted-foreground">
            メールアドレスを入力するだけ。クレジットカード不要、ずっと無料で使えます。
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <LoginForm mode="signup" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          すでにアカウントをお持ちの方は
          <Link
            href="/login"
            className="ml-1 font-medium text-brand underline-offset-2 hover:underline"
          >
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}
