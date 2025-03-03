import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { BookOpen } from 'lucide-react';

interface Funding {
  id: string;
  title: string;
  username: string;
  createdAt: any;
}

const FundingList: React.FC = () => {
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFundings = async () => {
      try {
        const q = query(collection(db, 'fundings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fundingList: Funding[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fundingList.push({
            id: doc.id,
            title: data.title,
            username: data.username,
            createdAt: data.createdAt
          });
        });
        
        setFundings(fundingList);
      } catch (err) {
        console.error('Error fetching fundings:', err);
        setError('投稿の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchFundings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">資金調達の投稿一覧</h1>
      
      {fundings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">投稿がありません</h2>
          <p className="text-gray-600 mb-4">
            まだ資金調達の投稿がありません。最初の投稿を作成しましょう。
          </p>
          <Link
            to="/create-funding"
            className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            資金調達を投稿する
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {fundings.map((funding) => (
              <li key={funding.id}>
                <Link
                  to={`/fundings/${funding.id}`}
                  className="block hover:bg-gray-50 transition-colors p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-indigo-600">{funding.title}</h2>
                      <p className="text-sm text-gray-600">投稿者: {funding.username}</p>
                    </div>
                    <div className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FundingList;