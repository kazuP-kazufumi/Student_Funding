import { defineConfig } from 'cypress';

export default defineConfig({
  // E2Eテストの設定
  e2e: {
    // テスト実行時のベースURL（開発サーバーのアドレス）
    baseUrl: 'http://localhost:5173',
    // テストファイルの配置場所
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    // テスト実行前の設定
    setupNodeEvents(on, config) {
      // カスタムタスクやプラグインの設定をここに記述
    },
  },
  // コンポーネントテストの設定
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    // コンポーネントテストファイルの配置場所
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
}); 