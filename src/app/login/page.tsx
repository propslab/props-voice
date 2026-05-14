import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "ログイン｜Props Voice",
};

export default function LoginPage() {
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
          <h1 className="text-2xl font-bold text-brand">Props Voice にログイン</h1>
          <p className="text-sm text-muted-foreground">
            登録済みのメールアドレスを入力してください
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <LoginForm mode="login" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          はじめての方は
          <Link
            href="/signup"
            className="ml-1 font-medium text-brand underline-offset-2 hover:underline"
          >
            無料でアカウント作成
          </Link>
        </p>
      </div>
    </main>
  );
}
