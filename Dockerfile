# ビルドステージ
FROM node:20-alpine as build

WORKDIR /app

# 依存関係のコピーとインストール
COPY package*.json ./
RUN npm ci

# ソースコードのコピー
COPY . .

# ビルド
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# ビルド成果物のコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginxの設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 