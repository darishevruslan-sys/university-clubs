import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClubs } from '../context/ClubsContext';

const Home = () => {
  const { user } = useAuth();
  const { clubs, initialized } = useClubs();

  const popularClubs = useMemo(() => clubs.slice(0, 6), [clubs]);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Университетские клубы интересов</h1>
          <p>
            Присоединяйтесь к сообществам единомышленников, развивайте свои интересы
            и находите новых друзей в университете
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/clubs" className="btn btn-primary btn-lg">
                Посмотреть клубы
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Зарегистрироваться
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="popular-clubs">
        <div className="container">
          <h2 className="section-title">Популярные клубы</h2>

          {!initialized ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="clubs-grid">
              {popularClubs.map((club) => (
                <div key={club._id} className="club-card">
                  <div className="club-category">{club.category}</div>
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-description">{club.description}</p>
                  <div className="club-members">
                    Участников: {club.members.length}
                  </div>
                  <Link
                    to={`/clubs/${club._id}`}
                    className="btn btn-outline"
                  >
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/clubs" className="btn btn-primary">
              Посмотреть все клубы
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
