import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // mainタグの存在を確認（より適切なテスト方法）
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
}); 