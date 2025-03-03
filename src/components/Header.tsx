import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <GraduationCap size={24} />
          <span>Student Funding Platform</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-indigo-200 transition-colors">
            TOP
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/notifications" className="relative hover:text-indigo-200 transition-colors">
                <Bell size={20} />
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="hover:text-indigo-200 transition-colors"
              >
                ログイン
              </Link>
              <Link 
                to="/register"
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
              >
                新規登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;