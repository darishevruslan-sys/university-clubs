import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import NewsWall from '../components/NewsWall';
import axios from 'axios';

const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClub();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchClub = async () => {
    try {
      const response = await axios.get(`/api/clubs/${id}`);
      setClub(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке клуба:', error);
      navigate('/clubs');
    } finally {
      setLoading(false);
    }
  };

  const isUserMember = () => {
    if (!user || !club) return false;
    return club.members.some(member => member._id === user.id);
  };

  const isUserCreator = () => {
    if (!user || !club) return false;
    return club.createdBy._id === user.id;
  };

  const handleJoinLeave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    setMessage('');

    try {
      const endpoint = isUserMember() ? 'leave' : 'join';
      const response = await axios.post(`/api/clubs/${id}/${endpoint}`);
      
      setMessage(response.data.message);
      // Обновляем данные клуба
      await fetchClub();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Произошла ошибка');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Клуб не найден</h2>
        <button onClick={() => navigate('/clubs')} className="btn btn-primary">
          Вернуться к клубам
        </button>
      </div>
    );
  }

  return (
    <div className="club-detail">
      <div className="container">
        {/* Club Header */}
        <div className="club-header">
          <h1 className="club-title">{club.name}</h1>
          <div className="club-category">{club.category}</div>
          
          <div className="club-meta">
            <p>{club.description}</p>
          </div>

          <div className="club-stats">
            <div className="club-stat">
              <div className="club-stat-number">{club.members.length}</div>
              <div className="club-stat-label">Участников</div>
            </div>
            <div className="club-stat">
              <div className="club-stat-number">
                {new Date(club.createdAt).toLocaleDateString('ru-RU')}
              </div>
              <div className="club-stat-label">Создан</div>
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('успешно') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <button
                  onClick={handleJoinLeave}
                  disabled={actionLoading}
                  className={`btn ${isUserMember() ? 'btn-danger' : 'btn-primary'}`}
                >
                  {actionLoading 
                    ? 'Загрузка...' 
                    : isUserMember() 
                      ? 'Покинуть клуб' 
                      : 'Вступить в клуб'
                  }
                </button>
                {isUserCreator() && (
                  <button
                    onClick={() => navigate(`/clubs/${id}/edit`)}
                    className="btn btn-outline"
                  >
                    Редактировать клуб
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Войти для участия
              </button>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <h2>Участники клуба ({club.members.length})</h2>
          
          {club.members.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              В клубе пока нет участников
            </p>
          ) : (
            <div className="members-grid">
              {club.members.map((member) => (
                <div key={member._id} className="member-card">
                  <div className="member-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500' }}>{member.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {member.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* News Wall Section */}
        {user && isUserMember() && (
          <NewsWall clubId={id} />
        )}

        {/* Chat Section */}
        {user && isUserMember() && (
          <Chat clubId={id} />
        )}
      </div>
    </div>
  );
};

export default ClubDetail;
