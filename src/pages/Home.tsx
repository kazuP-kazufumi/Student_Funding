import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, BookOpen, Users, Shield, Lock } from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { addSampleFundings } from '../utils/sampleData';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [hasFundings, setHasFundings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
      return;
    }

    const checkFundings = async () => {
      try {
        const q = query(collection(db, 'fundings'), limit(1));
        const querySnapshot = await getDocs(q);
        setHasFundings(!querySnapshot.empty);
        setLoading(false);
      } catch (err) {
        console.error('Error checking fundings:', err);
        setLoading(false);
      }
    };

    checkFundings();
  }, [currentUser, navigate]);

  const handleAddSampleData = async () => {
    if (hasFundings) return;
    
    setLoading(true);
    const success = await addSampleFundings();
    if (success) {
      setHasFundings(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-indigo-700">
                進学の夢を叶える新しい形
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                経済的な理由で進学を諦めなくてもいい世界へ。学生と投資家をつなぐプラットフォーム。
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700"
              >
                新規登録
              </Link>
              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-indigo-600 px-8 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700"
              >
                ログイン
              </Link>
            </div>
            
            {!loading && !hasFundings && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 mb-2">まだ投稿例がありません。サンプルデータを追加しますか？</p>
                <button
                  onClick={handleAddSampleData}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  投稿例を追加する
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-indigo-100 p-4 rounded-full">
                <GraduationCap className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">学生の可能性を広げる</h3>
                <p className="text-gray-600">
                  経済的な理由で進学を諦めなくてもいいように、新しい資金調達の形を提供します。
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-indigo-100 p-4 rounded-full">
                <Users className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">投資家との直接マッチング</h3>
                <p className="text-gray-600">
                  あなたの夢や目標に共感してくれる投資家と直接つながることができます。
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-indigo-100 p-4 rounded-full">
                <BookOpen className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">借金ではなく投資として</h3>
                <p className="text-gray-600">
                  教育ローンや奨学金とは異なり、借金を背負わずに進学資金を調達できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-indigo-700">
                始めてみましょう
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                あなたの進学の夢を叶えるための第一歩を踏み出しましょう。
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
              <Link
                to="/register"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Users className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">新規登録</h3>
                <p className="text-center text-gray-600">アカウントを作成して始めましょう</p>
              </Link>
              <Link
                to="/fundings"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <BookOpen className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">投稿を見る</h3>
                <p className="text-center text-gray-600">学生たちの夢や目標をチェック</p>
              </Link>
              <Link
                to="/terms"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Shield className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">利用規約</h3>
                <p className="text-center text-gray-600">サービスの利用規約を確認</p>
              </Link>
              <Link
                to="/privacy"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1 mx-auto"
              >
                <Lock className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">プライバシーポリシー</h3>
                <p className="text-center text-gray-600">個人情報の取り扱いについて</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;