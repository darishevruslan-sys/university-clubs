import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreateClub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Спорт',
    'Культура', 
    'IT',
    'Творчество',
    'Развлечения'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Валидация
    if (!formData.name.trim()) {
      setError('Название клуба обязательно');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Описание клуба обязательно');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Выберите категорию клуба');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/clubs', formData);
      setError('');
      // Перенаправляем на страницу созданного клуба
      navigate(`/clubs/${response.data.club._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при создании клуба');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Необходимо войти в систему</h2>
        <p>Для создания клуба необходимо быть авторизованным пользователем</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Войти
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 className="auth-title">Создать новый клуб</h1>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Название клуба *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Введите название клуба"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Категория *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Описание клуба *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="4"
                placeholder="Опишите деятельность клуба, его цели и интересы"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Создание...' : 'Создать клуб'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/clubs')}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >

                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
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

export default CreateClub;
