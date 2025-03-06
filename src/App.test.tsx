import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    // TestWrapperでAppコンポーネントをラップ
    const { container } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // mainタグの存在を確認（より安全なテスト方法）
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeTruthy();
  });
}); 