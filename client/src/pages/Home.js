import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [popularClubs, setPopularClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularClubs = async () => {
      try {
        const response = await axios.get('/api/clubs');
        setPopularClubs(response.data.slice(0, 6));
      } catch (error) {
        console.error('Ошибка при загрузке клубов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularClubs();
  }, []);

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
            <Link to="/clubs" className="btn btn-primary btn-lg">
              Посмотреть клубы
            </Link>
          </div>
        </div>
      </section>

      <section className="popular-clubs">
        <div className="container">
          <h2 className="section-title">Популярные клубы</h2>

          {loading ? (
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
                  <div className="club-members">Участников: {club.members.length}</div>
                  <Link to={`/clubs/${club._id}`} className="btn btn-outline">
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
