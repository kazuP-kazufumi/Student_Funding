import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Shield, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <GraduationCap size={24} className="mr-2" />
            <span className="text-xl font-bold">Student Funding Platform</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link to="/" className="hover:text-indigo-300 transition-colors flex items-center">
              <span>TOP</span>
            </Link>
            <Link to="/terms" className="hover:text-indigo-300 transition-colors flex items-center">
              <Shield size={16} className="mr-1" />
              <span>利用規約</span>
            </Link>
            <Link to="/privacy" className="hover:text-indigo-300 transition-colors flex items-center">
              <Lock size={16} className="mr-1" />
              <span>プライバシーポリシー</span>
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>© 2025 Student Funding Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;