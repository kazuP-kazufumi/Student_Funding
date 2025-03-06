import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Vitestの拡張設定
expect.extend(matchers as any);

// 各テスト後にクリーンアップを実行
afterEach(() => {
  cleanup();
}); 