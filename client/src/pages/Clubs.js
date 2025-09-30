import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClubs } from '../context/ClubsContext';

const categories = [
  { value: 'all', label: 'Все клубы' },
  { value: 'Спорт', label: 'Спорт' },
  { value: 'Культура', label: 'Культура' },
  { value: 'IT', label: 'IT' },
  { value: 'Творчество', label: 'Творчество' },
  { value: 'Развлечения', label: 'Развлечения' },
];

const Clubs = () => {
  const { user } = useAuth();
  const { clubs, initialized } = useClubs();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredClubs = useMemo(() => {
    if (selectedCategory === 'all') {
      return clubs;
    }

    return clubs.filter((club) => club.category === selectedCategory);
  }, [clubs, selectedCategory]);

  if (!initialized) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="filter-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Каталог клубов</h2>
            {user && (
              <Link to="/create-club" className="btn btn-primary">
                Создать клуб
              </Link>
            )}
          </div>
          <div className="filter-tabs">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`filter-tab ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0' }}>
        <div className="container">
          {filteredClubs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>Клубы не найдены</h3>
              <p>Попробуйте выбрать другую категорию</p>
            </div>
          ) : (
            <div className="clubs-grid">
              {filteredClubs.map((club) => (
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
        </div>
      </section>
    </div>
  );
};

export default Clubs;
