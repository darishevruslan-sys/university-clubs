import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchClub();
  }, [id, navigate]);

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
        </div>

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
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="club-disabled-features">
          <div className="info-card">
            <h3>Онлайн-активности временно недоступны</h3>
            <p>
              Функции вступления в клуб, публикации новостей и общения в чате отключены
              и доступны только в полной версии платформы.
            </p>
            <p>
              Пока что вы можете ознакомиться с описанием клуба и списком участников.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
