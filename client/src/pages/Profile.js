import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, fetchUserProfile } = useAuth();
  const [userClubs, setUserClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchUserClubs();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserClubs = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get('/api/profile');
      setUserClubs(response.data.user.joinedClubs || []);
    } catch (error) {
      console.error('Ошибка при загрузке клубов пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClub = async (clubId) => {
    setActionLoading(prev => ({ ...prev, [clubId]: true }));

    try {
      await axios.post(`/api/clubs/${clubId}/leave`);
      // Обновляем список клубов пользователя
      await fetchUserProfile();
      await fetchUserClubs();
    } catch (error) {
      console.error('Ошибка при выходе из клуба:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [clubId]: false }));
    }
  };

  const isUserCreator = (club) => {
    if (!user || !club) return false;
    return club.createdBy._id === user.id;
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Пользователь не найден</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        {/* User Clubs */}
        <div className="user-clubs">
          <h2>Мои клубы ({userClubs.length})</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : userClubs.length === 0 ? (
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
<!--LiveInternet counter--><a href="https://www.liveinternet.ru/click"
target="_blank"><img id="licntD8A3" width="88" height="31" style="border:0" 
title="LiveInternet: показано число просмотров и посетителей за 24 часа"
src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAIBTAA7"
alt=""/></a><script>(function(d,s){d.getElementById("licntD8A3").src=
"https://counter.yadro.ru/hit?t53.11;r"+escape(d.referrer)+
((typeof(s)=="undefined")?"":";s"+s.width+"*"+s.height+"*"+
(s.colorDepth?s.colorDepth:s.pixelDepth))+";u"+escape(d.URL)+
";h"+escape(d.title.substring(0,150))+";"+Math.random()})
(document,screen)</script><!--/LiveInternet-->

};

export default Profile;
