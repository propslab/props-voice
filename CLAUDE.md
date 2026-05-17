# Props Voice

Props Lab の SaaS。`voice.props-lab.com` で公開予定。

## 戦略上の位置付け（2026-05-17 更新：3段階ファネル戦略）

```
Free（コマセ・無料リード獲得）
  ↓
Standard ¥1,980/月（ツール本格活用・本サービス）
  ↓
Props Lab 顧問契約 ¥8,000〜¥80,000/月（人による伴走）
```

**Free がコマセ、Standard が本サービス、顧問契約がアップセル先。** 3段階のファネルで自然に収益化と Props Lab への誘導を両立する。

実装判断に迷ったら **「3段階のどこで価値を提供しているか？」** を基準にする。

## 戦略上の禁止事項（実装時の絶対ライン）

- 仕様書にない機能を勝手に追加しない
- レビューゲーティング（評価別分岐）は永続的に禁止（Google ポリシー違反グレー）
- 返信案生成は顧問契約の付加価値として温存（Standard にも入れない）
- **Premium / Enterprise など Standard 超のプランは作らない**（顧問契約とカニバる）
- 棲み分け原則: Standard = ツール機能、顧問契約 = 人による伴走・業務改善・補助金・他社ツール統合

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
