import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, User } from 'lucide-react';

interface FundingData {
  id: string;
  title: string;
  description: string;
  username: string;
  userId: string;
  createdAt: any;
}

const FundingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [funding, setFunding] = useState<FundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        if (!id) return;
        
        const docRef = doc(db, 'fundings', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFunding({
            id: docSnap.id,
            ...docSnap.data()
          } as FundingData);
        } else {
          setError('投稿が見つかりませんでした');
        }
      } catch (err) {
        console.error('Error fetching funding:', err);
        setError('投稿の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchFunding();
  }, [id]);

  const handleSupportRequest = async () => {
    if (!currentUser || !funding) return;
    
    try {
      setSupportLoading(true);
      
      // Create notification
      await addDoc(collection(db, 'notifications'), {
        type: 'support_request',
        fundingId: funding.id,
        fundingTitle: funding.title,
        recipientId: funding.userId,
        senderId: currentUser.uid,
        read: false,
        createdAt: serverTimestamp()
      });
      
      setSupportSuccess(true);
    } catch (err) {
      console.error('Error sending support request:', err);
      setError('支援申し込みの送信に失敗しました');
    } finally {
      setSupportLoading(false);
    }
  };

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

  if (!funding) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        投稿が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">{funding.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <div className="flex items-center mr-6">
            <User className="h-4 w-4 mr-1" />
            <span>{funding.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {funding.createdAt?.toDate 
                ? funding.createdAt.toDate().toLocaleDateString('ja-JP') 
                : '日付不明'}
            </span>
          </div>
        </div>
        
        <div className="prose max-w-none mb-8">
          <p className="whitespace-pre-line">{funding.description}</p>
        </div>
        
        {supportSuccess ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            支援申し込みを送信しました。投稿者からの返信をお待ちください。
          </div>
        ) : (
          currentUser ? (
            currentUser.uid !== funding.userId && (
              <button
                onClick={handleSupportRequest}
                disabled={supportLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {supportLoading ? '送信中...' : '支援を申し込む'}
              </button>
            )
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">支援を申し込むにはログインが必要です</p>
              <Link
                to="/login"
                className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
              >
                ログイン
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FundingDetail;