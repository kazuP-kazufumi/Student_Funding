import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

interface ChatUser {
  id: string;
  username: string;
}

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const { currentUser, userData } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chat user info
  useEffect(() => {
    const fetchChatUser = async () => {
      if (!userId) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setChatUser({
            id: userDoc.id,
            username: userDoc.data().username
          });
        }
      } catch (err) {
        console.error('Error fetching chat user:', err);
      }
    };

    fetchChatUser();
  }, [userId]);

  // Listen for messages
  useEffect(() => {
    if (!currentUser || !userId) return;
    
    const chatId = [currentUser.uid, userId].sort().join('_');
    
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({
          id: doc.id,
          ...doc.data()
        } as Message);
      });
      
      setMessages(messagesList);
      setLoading(false);
      
      // Scroll to bottom when new messages arrive
      setTimeout(scrollToBottom, 100);
    }, (err) => {
      console.error('Error listening to messages:', err);
      setError('メッセージの取得に失敗しました');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser, userId]);

  // Scroll to bottom on first load
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser || !userId) return;
    
    try {
      const chatId = [currentUser.uid, userId].sort().join('_');
      
      await addDoc(collection(db, 'messages'), {
        chatId,
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('メッセージの送信に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
        <h1 className="text-xl font-semibold">
          {chatUser ? chatUser.username : 'チャット'}とのメッセージ
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex-grow bg-white overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            メッセージはまだありません。会話を始めましょう。
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser?.uid;
            
            return (
              <div 
                key={message.id} 
                className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {message.createdAt?.toDate 
                      ? message.createdAt.toDate().toLocaleTimeString('ja-JP', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) 
                      : '送信中...'}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="bg-white rounded-b-lg shadow-md p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;