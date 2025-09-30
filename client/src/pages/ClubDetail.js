import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
        <Link to="/clubs" className="btn btn-primary">
          Вернуться к клубам
        </Link>
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

          <div
            style={{
              marginTop: '24px',
              background: '#f8fafc',
              padding: '16px 20px',
              borderRadius: '12px',
              color: '#475569',
            }}
          >
            Информация о вступлении и внутренних активностях клуба предоставляется
            на официальных мероприятиях или через представителей клуба.
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link to="/clubs" className="btn btn-outline">
            Вернуться ко всем клубам
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
