# 開発ガイド

## セットアップ

### Docker Compose (推奨)

```bash
# 起動
docker compose up --build

# アクセス
# - フロントエンド: http://localhost:3000
# - バックエンド API: http://localhost:8000
```

### ローカル開発

```bash
# フロントエンド
cd client
bun install
bun dev

# バックエンド
cd backend
pip install -r requirements.txt
make dev
```

## テスト

```bash
# フロントエンド
cd client
bun run test      # lint + typecheck + vitest
bun run e2e       # Playwright E2E テスト

# バックエンド
cd backend
make test         # pytest + lint + typecheck
```

## デプロイ

```bash
# AWS へデプロイ (要: direnv allow)
./scripts/deploy.sh all       # backend + frontend
./scripts/deploy.sh backend   # backend のみ
./scripts/deploy.sh frontend  # frontend のみ
```
