export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Props Lab
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-brand leading-tight">
          PropsVoice
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          QRを置くだけで、来店客の声が
          <br className="hidden sm:inline" />
          Google レビューとして積み上がる、
          <br className="hidden sm:inline" />
          無料の口コミ収集ツール。
        </p>
        <p className="text-sm text-muted-foreground">
          現在準備中です。Day 5 で本ランディングを公開予定。
        </p>
      </div>
    </main>
  );
}
