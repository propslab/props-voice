import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ReviewFlow } from "./review-flow";

export const metadata = {
  title: "口コミを投稿｜Props Voice",
};

export default async function PublicReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServiceClient();
  const { data: store } = await supabase
    .from("stores")
    .select()
    .eq("slug", slug)
    .maybeSingle();

  if (!store) {
    notFound();
  }

  return (
    <main className="flex-1 relative">
      {/* 上部の紺グラデーション装飾 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand via-brand-soft to-transparent pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-72 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, white 1px, transparent 1px), radial-gradient(circle at 75% 60%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px",
        }}
      />

      <div className="relative px-4 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-md space-y-7">
          {/* ヒーロー部 */}
          <div className="text-center space-y-3 text-brand-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/20">
              <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/90">
                Voice Collection
              </p>
            </div>
            <h1 className="text-[1.75rem] sm:text-3xl font-bold leading-tight text-white">
              {store.name}
            </h1>
            <p className="text-sm text-white/75 leading-relaxed">
              ご来店ありがとうございました。
              <br />
              一言お聞かせください。
            </p>
          </div>

          <ReviewFlow slug={store.slug} />

          <div className="pt-2 text-center">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="block h-1 w-1 rounded-full bg-accent/70" />
              Powered by
              <span className="font-semibold text-foreground/80">
                Props Voice
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
