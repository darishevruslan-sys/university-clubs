import React from 'react';
import { Link } from 'react-router-dom';
import clubs from '../data/clubs';

const Home = () => {
  const popularClubs = clubs.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Университетские клубы интересов</h1>
          <p>
            Присоединяйтесь к сообществам единомышленников, развивайте свои интересы 
            и находите новых друзей в университете
          </p>
          <div className="hero-actions">
            <Link to="/clubs" className="btn btn-primary btn-lg">
              Посмотреть клубы
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Регистрация
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Clubs Section */}
      <section className="popular-clubs">
        <div className="container">
          <h2 className="section-title">Популярные клубы</h2>
          
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
