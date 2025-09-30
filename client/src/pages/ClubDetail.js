import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClubs } from '../context/ClubsContext';

const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clubs, initialized, joinClub, leaveClub } = useClubs();

  const club = useMemo(() => clubs.find((item) => item._id === id) || null, [clubs, id]);

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
    setActionLoading(false);
  }, [id]);

  useEffect(() => {
    if (initialized && !club) {
      navigate('/clubs', { replace: true });
    }
  }, [initialized, club, navigate]);

  const isUserMember = () => {
    if (!user || !club) return false;
    return club.members.some((member) => member._id === user.id);
  };

  const isUserCreator = () => {
    if (!user || !club) return false;
    return club.createdBy?._id === user.id;
  };

  const handleJoinLeave = () => {
    if (!user || !club) {
      navigate('/login');
      return;
    }

    setActionLoading(true);

    if (isUserMember()) {
      leaveClub(club._id, user.id);
      setMessage('Вы вышли из клуба. Возвращайтесь, когда захотите!');
    } else {
      joinClub(club._id, {
        _id: user.id,
        name: user.name,
        email: user.email,
      });
      setMessage('Добро пожаловать! Вы присоединились к клубу.');
    }

    setTimeout(() => {
      setActionLoading(false);
    }, 300);
  };

  if (!initialized) {
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

          {club.createdBy && (
            <div className="club-organizer">
              <span className="club-organizer-label">Организатор:</span>
              <span className="club-organizer-name">{club.createdBy.name}</span>
              {club.createdBy.email && (
                <a
                  href={`mailto:${club.createdBy.email}`}
                  className="club-organizer-contact"
                >
                  {club.createdBy.email}
                </a>
              )}
            </div>
          )}

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
            <div className={`alert ${message.includes('Добро пожаловать') ? 'alert-success' : 'alert-info'}`}>
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

        {club.activities?.length > 0 && (
          <div className="club-info-section">
            <h2>Чем занимается клуб</h2>
            <div className="club-info-grid">
              {club.activities.map((activity) => (
                <div key={activity.id} className="club-info-card">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {club.upcomingEvents?.length > 0 && (
          <div className="club-info-section">
            <h2>Ближайшие события</h2>
            <div className="club-events-list">
              {club.upcomingEvents.map((event) => (
                <div key={event.id} className="club-event">
                  <div>
                    <div className="club-event-title">{event.title}</div>
                    <div className="club-event-meta">
                      {new Date(event.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="club-event-location">{event.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {club.resources?.length > 0 && (
          <div className="club-info-section">
            <h2>Полезные ссылки</h2>
            <ul className="club-resources">
              {club.resources.map((resource) => (
                <li key={resource.id}>
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetail;
