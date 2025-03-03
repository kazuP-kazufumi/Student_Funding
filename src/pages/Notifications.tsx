import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'support_request';
  fundingId: string;
  fundingTitle: string;
  senderId: string;
  senderName?: string;
  read: boolean;
  createdAt: any;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      
      try {
        const q = query(
          collection(db, 'notifications'),
          where('recipientId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notificationsList: Notification[] = [];
        
        for (const docSnapshot of querySnapshot.docs) {
          const notificationData = docSnapshot.data() as Omit<Notification, 'id' | 'senderName'>;
          
          // Get sender name
          let senderName = 'Unknown User';
          try {
            const senderDoc = await getDoc(doc(db, 'users', notificationData.senderId));
            if (senderDoc.exists()) {
              senderName = senderDoc.data().username;
            }
          } catch (err) {
            console.error('Error fetching sender data:', err);
          }
          
          notificationsList.push({
            id: docSnapshot.id,
            ...notificationData,
            senderName
          });
        }
        
        setNotifications(notificationsList);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('通知の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const startChat = async (notification: Notification) => {
    try {
      // Mark notification as read
      await updateDoc(doc(db, 'notifications', notification.id), {
        read: true
      });
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ));
      
      // Create chat or navigate to existing chat
      // For simplicity, we'll just navigate to the chat page with the sender's ID
      window.location.href = `/chat/${notification.senderId}`;
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('チャットの開始に失敗しました');
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

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">通知</h1>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Bell className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">通知はありません</h2>
          <p className="text-gray-600">
            新しい通知が届くとここに表示されます。
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id} className={`p-4 ${!notification.read ? 'bg-indigo-50' : ''}`}>
                <div className="mb-2">
                  <span className="font-medium text-indigo-600">{notification.senderName}</span>
                  <span className="text-gray-600"> が </span>
                  <span className="font-medium">「{notification.fundingTitle}」</span>
                  <span className="text-gray-600"> への支援を申し込みました</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {notification.createdAt?.toDate 
                      ? notification.createdAt.toDate().toLocaleString('ja-JP') 
                      : '日時不明'}
                  </span>
                  
                  {!notification.read && (
                    <button
                      onClick={() => startChat(notification)}
                      className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      交渉を開始する
                    </button>
                  )}
                  
                  {notification.read && (
                    <Link
                      to={`/chat/${notification.senderId}`}
                      className="flex items-center text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      チャットを続ける
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;