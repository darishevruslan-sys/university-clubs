import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Chat = ({ clubId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [clubId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/clubs/${clubId}/messages`);
      setMessages(response.data.messages);
    } catch (error) {
      setError('Ошибка при загрузке сообщений');
      console.error('Ошибка при загрузке сообщений:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    setError('');

    try {
      const response = await axios.post(`/api/clubs/${clubId}/messages`, {
        content: newMessage
      });

      setMessages(prev => [...prev, response.data.data]);
      setNewMessage('');
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при отправке сообщения');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  if (!user) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h3>Чат клуба</h3>
        </div>
        <div className="chat-messages">
          <div className="chat-placeholder">
            <p>Войдите в систему, чтобы участвовать в чате</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Чат клуба</h3>
        <div className="chat-members-count">
          {messages.length > 0 && `${messages.length} сообщений`}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ margin: '16px' }}>
          {error}
        </div>
      )}

      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">
            <div className="spinner"></div>
            <p>Загрузка сообщений...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-placeholder">
            <p>Пока нет сообщений. Будьте первым, кто напишет!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id} 
              className={`message ${message.author._id === user.id ? 'message-own' : 'message-other'}`}
            >
              <div className="message-avatar">
                {message.author.name.charAt(0).toUpperCase()}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">
                    {message.author.name}
                    {message.author._id === user.id && ' (Вы)'}
                  </span>
                  <span className="message-time">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <div className="message-text">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="chat-input"
            disabled={sending}
            maxLength={500}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
        <div className="chat-input-info">
          <span>Максимум 500 символов</span>
        </div>
      </form>
    </div>
  );
};

export default Chat;

