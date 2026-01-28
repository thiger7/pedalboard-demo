# Pedalboard Demo

ギターエフェクターをシミュレートする Web アプリケーション。

## 概要

ブラウザ上でギターエフェクターを並べ替え、音声ファイルにエフェクトを適用できるデモアプリです。

## アーキテクチャ

- **client/** - React + TypeScript + Vite
  - エフェクターボードの UI
  - ドラッグ&ドロップでエフェクトの並び替え
  - 波形表示 (wavesurfer.js)
- **backend/** - FastAPI + Python
  - REST API エンドポイント
  - 音声処理 (Spotify Pedalboard ライブラリ)
  - Lambda 関数としてもデプロイ可能

## 技術スタック

### フロントエンド (client/)
- **React** - UI フレームワーク
- **TypeScript** - 型安全
- **Vite** - ビルドツール
- **Vitest** - ユニットテスト
- **Playwright** - E2E テスト
- **Biome** - Linter/Formatter
- **wavesurfer.js** - 波形表示
- **dnd-kit** - ドラッグ&ドロップ

### バックエンド (backend/)
- **FastAPI** - Web フレームワーク
- **Pedalboard** - Spotify の音声処理ライブラリ
- **pytest** - テストフレームワーク
- **ruff** - Linter/Formatter
- **pyright** - 型チェッカー
- **pip-audit** - 脆弱性チェック

### CI/CD
- **GitHub Actions** - 自動テスト・静的解析

### 保守
- **Renovate** - 依存関係の自動更新

## エフェクト一覧

| カテゴリ | エフェクト |
|----------|------------|
| 歪み系 | Booster, Blues Driver, OverDrive, Distortion, Fuzz, Metal Zone, Heavy Metal |
| モジュレーション系 | Chorus, Dimension, Vibrato |
| 空間系 | Delay, Reverb |
