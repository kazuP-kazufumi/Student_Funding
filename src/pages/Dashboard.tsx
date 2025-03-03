import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Bell, BookOpen, Shield, Lock, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();

  if (!currentUser) {
    return <Link to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ダッシュボード</h1>
        <p className="text-gray-600 mb-2">
          ようこそ、{userData?.username || currentUser.email}さん
        </p>
        <p className="text-gray-600">
          このプラットフォームで、あなたの進学の夢を叶えるための資金調達を始めましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/create-funding"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <PlusCircle className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">資金を調達する</h2>
          <p className="text-gray-600">
            あなたの進学の夢や目標を投稿して、資金調達を始めましょう
          </p>
        </Link>

        <Link
          to="/notifications"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <Bell className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">通知を確認する</h2>
          <p className="text-gray-600">
            あなたの投稿に対する支援申し込みや新しいメッセージを確認
          </p>
        </Link>

        <Link
          to="/fundings"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">投稿を見る</h2>
          <p className="text-gray-600">
            他の学生の夢や目標をチェックして、支援することもできます
          </p>
        </Link>

        <Link
          to="/terms"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <Shield className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">利用規約</h2>
          <p className="text-gray-600">
            サービスの利用規約を確認する
          </p>
        </Link>

        <Link
          to="/privacy"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <Lock className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">プライバシーポリシー</h2>
          <p className="text-gray-600">
            個人情報の取り扱いについて確認する
          </p>
        </Link>

        <button
          onClick={() => logout()}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <LogOut className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">ログアウトする</h2>
          <p className="text-gray-600">
            アカウントからログアウトする
          </p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;