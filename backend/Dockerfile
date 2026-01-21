FROM python:3.13-slim

WORKDIR /app

# システム依存関係のインストール（pedalboardに必要）
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY lambda_function.py .
COPY backend/main.py .

# 音声ファイル用ディレクトリを作成
RUN mkdir -p /app/audio/input /app/audio/output

EXPOSE 8000

# ホットリロード有効でuvicornを起動
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
