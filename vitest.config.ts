/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vitestの設定をexport
export default defineConfig({
  plugins: [react()],
  test: {
    // テスト環境としてhappy-domを使用（ブラウザライクな環境をシミュレート）
    environment: 'happy-dom',
    // グローバルなテストユーティリティを自動的にインポート
    globals: true,
    // セットアップファイルを指定
    setupFiles: ['./src/setupTests.ts'],
    // テストのカバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        '**/*.d.ts',
      ],
    },
  },
}); 