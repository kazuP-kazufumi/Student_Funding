import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  register: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  userData: { username: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  register: async () => {},
  login: async () => {},
  guestLogin: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
  userData: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as { username: string });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString()
      });
      
      setUserData({ username });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const guestLogin = async () => {
    try {
      setError(null);
      const result = await signInAnonymously(auth);
      
      // Create guest user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        username: `ゲスト${result.user.uid.slice(0, 4)}`,
        isGuest: true,
        createdAt: new Date().toISOString()
      });
      
      setUserData({ username: `ゲスト${result.user.uid.slice(0, 4)}` });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    register,
    login,
    guestLogin,
    logout,
    loading,
    error,
    userData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};