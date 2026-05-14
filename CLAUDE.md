# PropsVoice

Props Lab のコマセツール（無料口コミ収集SaaS）。`voice.props-lab.jp` で公開予定。

## 戦略上の位置付け

**PropsVoice は単独事業ではなく、Props Lab（月額¥8,000-¥80,000 IT顧問業）への集客装置（コマセ）。**

実装判断に迷ったら **「これはコマセの本質か？」** を基準にする。

## 戦略上の禁止事項（実装時の絶対ライン）

- 仕様書にない機能を勝手に追加しない
- 課金システム（Stripe）・サブスク管理は MVP 外
- レビューゲーティング（評価別分岐）は永続的に禁止（Google ポリシー違反グレー）
- 返信案生成は顧問契約の付加価値として温存
- **プレミアムプラン以上は永続的に作らない**（Props Lab 顧問契約とカニバる）

## 技術スタック（確定、議論不要）

- Next.js 15（App Router） + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase Pro（Auth + DB、Magic Link）
- Anthropic Claude `claude-haiku-4-5-20251001`
- qrcode.react
- Vercel Pro

## 実装上の絶対ルール

- **Claude API は Server Action または Route Handler 経由**（API キーをクライアントに出さない）
- **Supabase RLS は最初に正しく設定**（後で直すのは大変）
- **過剰なバリデーション・エラーハンドリング禁止**（最低限のサニタイズ＋シンプルなエラーメッセージで十分）
- **モバイル動作確認は必ず実機で**（特に `/r/[slug]` は iOS Safari + Android Chrome 必須）

## Google レビューポリシー遵守（絶対）

- 自動投稿しない（必ず本人がコピペ）
- 対価誘導しない（「投稿したら割引」等は禁止）
- 評価別フィルタリングしない（★1-3 も同じく Google に誘導）

## 組織コンテキスト

このプロジェクトは仮想組織で運営されています。詳細は `.company/CLAUDE.md` を参照。

- 進捗管理・チケット: `.company/pm/`
- 技術ドキュメント・デバッグログ: `.company/engineering/`
- 戦略意思決定・TODO・壁打ち: `.company/secretary/`

## 言語

- ユーザー対応・コミットメッセージは日本語
