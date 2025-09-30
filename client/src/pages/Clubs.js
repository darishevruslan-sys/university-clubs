import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'Все клубы' },
    { value: 'Спорт', label: 'Спорт' },
    { value: 'Культура', label: 'Культура' },
    { value: 'IT', label: 'IT' },
    { value: 'Творчество', label: 'Творчество' },
    { value: 'Развлечения', label: 'Развлечения' }
  ];

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    filterClubs();
  }, [clubs, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchClubs = async () => {
    try {
      const response = await axios.get('/api/clubs');
      setClubs(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке клубов:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClubs = () => {
    if (selectedCategory === 'all') {
      setFilteredClubs(clubs);
    } else {
      setFilteredClubs(clubs.filter(club => club.category === selectedCategory));
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* Filter Section */}
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
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </div>
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

  );
};

export default Clubs;
