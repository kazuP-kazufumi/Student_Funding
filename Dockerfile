# ===== ベースステージ =====
# 全ステージで共通して使用する基本イメージの設定
FROM node:20-alpine as base
# コンテナ内の作業ディレクトリを設定
WORKDIR /app
# package.jsonとpackage-lock.jsonのみを先にコピー（キャッシュ活用のため）
COPY package*.json ./

# ===== 開発環境ステージ =====
# 開発用のステージを作成
FROM base as development
# 開発用の依存関係をインストール（devDependenciesを含む）
RUN npm install
# ソースコードをコンテナにコピー
COPY . .
# Vite開発サーバーのポートを開放
EXPOSE 5173
# 開発サーバーを起動
CMD ["npm", "run", "dev"]

# ===== ビルドステージ =====
# プロダクション用ビルドを行うステージ
FROM base as build
# プロダクション用の依存関係のみをインストール（--productionフラグ付きのnpm ci）
RUN npm ci
# ソースコードをコンテナにコピー
COPY . .
# プロダクション用にビルド
RUN npm run build

# ===== 本番環境ステージ =====
# Nginxベースの軽量イメージを使用
FROM nginx:alpine as production
# ビルドステージで生成された成果物をNginxのドキュメントルートにコピー
COPY --from=build /app/dist /usr/share/nginx/html
# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Nginxの標準ポートを開放
EXPOSE 80
# Nginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"] 