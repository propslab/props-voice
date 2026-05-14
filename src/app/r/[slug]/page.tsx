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
    <main className="flex-1 px-4 py-8 sm:py-12 bg-muted/40">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            お声をお聞かせください
          </p>
          <h1 className="text-2xl font-bold text-brand">{store.name}</h1>
        </div>

        <ReviewFlow slug={store.slug} />

        <p className="text-center text-xs text-muted-foreground">
          Powered by Props Voice
        </p>
      </div>
    </main>
  );
}
