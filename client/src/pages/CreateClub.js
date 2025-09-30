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
  );
};

export default CreateClub;
