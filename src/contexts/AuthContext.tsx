import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  Auth
} from 'firebase/auth';
import { auth } from '../firebase';

// 認証コンテキストの型定義
interface AuthContextType {
  currentUser: FirebaseUser | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | null>(null);

// カスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 認証プロバイダーコンポーネント
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // サインアップ関数
  function signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth as Auth, email, password);
  }

  // ログイン関数
  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth as Auth, email, password);
  }

  // ログアウト関数
  function logout(): Promise<void> {
    return signOut(auth as Auth);
  }

  // ユーザー状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;