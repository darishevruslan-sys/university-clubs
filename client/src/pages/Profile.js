import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClubs } from '../context/ClubsContext';

const Profile = () => {
  const { user } = useAuth();
  const { clubs, initialized, leaveClub } = useClubs();
  const [actionLoading, setActionLoading] = useState({});

  const userClubs = useMemo(() => {
    if (!user) {
      return [];
    }

    return clubs.filter((club) => club.members.some((member) => member._id === user.id));
  }, [clubs, user]);

  const handleLeaveClub = (clubId) => {
    setActionLoading((prev) => ({ ...prev, [clubId]: true }));

    setTimeout(() => {
      leaveClub(clubId, user.id);
      setActionLoading((prev) => ({ ...prev, [clubId]: false }));
    }, 300);
  };

  const isUserCreator = (club) => {
    if (!user || !club) return false;
    return club.createdBy?._id === user.id;
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Пользователь не найден</h2>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="user-clubs">
          <h2>Мои клубы ({userClubs.length})</h2>

          {userClubs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Вы пока не состоите ни в одном клубе
              </p>
              <Link to="/clubs" className="btn btn-primary">
                Посмотреть клубы
              </Link>
            </div>
          ) : (
            <div className="clubs-grid">
              {userClubs.map((club) => (
                <div key={club._id} className="club-card">
                  <div className="club-category">{club.category}</div>
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-description">{club.description}</p>
                  <div className="club-members">
                    Участников: {club.members.length}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <Link
                      to={`/clubs/${club._id}`}
                      className="btn btn-outline"
                    >
                      Подробнее
                    </Link>
                    {isUserCreator(club) && (
                      <Link
                        to={`/clubs/${club._id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        Редактировать
                      </Link>
                    )}
                    <button
                      onClick={() => handleLeaveClub(club._id)}
                      disabled={actionLoading[club._id]}
                      className="btn btn-danger btn-sm"
                    >
                      {actionLoading[club._id] ? 'Выход...' : 'Выйти'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
