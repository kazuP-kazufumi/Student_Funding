import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('App', () => {
  it('renders without crashing', async () => {
    let container: HTMLElement;
    
    // actでラップしてレンダリング
    await act(async () => {
      const result = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      container = result.container;
    });

    // mainタグの存在を確認
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeTruthy();
  });
}); 