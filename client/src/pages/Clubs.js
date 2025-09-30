import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clubs from '../data/clubs';

const Clubs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'Все клубы' },
    { value: 'Спорт', label: 'Спорт' },
    { value: 'Культура', label: 'Культура' },
    { value: 'IT', label: 'IT' },
    { value: 'Творчество', label: 'Творчество' },
    { value: 'Развлечения', label: 'Развлечения' }
  ];

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        club.name.toLowerCase().includes(normalizedSearch) ||
        club.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, normalizedSearch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Каталог клубов</h2>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '360px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Поиск по названию или описанию"
                className="input"
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                🔍
              </span>
            </div>
          </div>
          <div className="filter-tabs">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`filter-tab ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          {filteredClubs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>Клубы не найдены</h3>
              <p>Попробуйте изменить поисковый запрос или категорию.</p>
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
