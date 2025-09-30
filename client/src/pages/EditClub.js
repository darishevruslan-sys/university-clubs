import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClubs } from '../context/ClubsContext';

const EditClub = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initialized, getClubById, updateClub } = useClubs();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const club = useMemo(() => getClubById(id), [getClubById, id]);

  const categories = [
    'Спорт',
    'Культура',
    'IT',
    'Творчество',
    'Развлечения'
  ];

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!club) {
      setError('Клуб не найден');
      setReady(true);
      return;
    }

    if (club.createdBy?._id !== user?.id) {
      setError('У вас нет прав для редактирования этого клуба');
      setReady(true);
      return;
    }

    setFormData({
      name: club.name,
      description: club.description,
      category: club.category
    });
    setError('');
    setReady(true);
  }, [initialized, club, user]);

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
      const updated = updateClub(id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
      });

      if (!updated) {
        setError('Не удалось обновить клуб. Попробуйте снова.');
        setLoading(false);
        return;
      }

      navigate(`/clubs/${id}`);
    } catch (updateError) {
      console.error('Ошибка при обновлении клуба:', updateError);
      setError('Не удалось обновить клуб. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Необходимо войти в систему</h2>
        <p>Для редактирования клуба необходимо быть авторизованным пользователем</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Войти
        </button>
      </div>
    );
  }

  if (!initialized || !ready) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && club?.createdBy?._id !== user.id) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ marginBottom: '24px' }}>
          {error}
        </div>
        <button onClick={() => navigate('/clubs')} className="btn btn-primary">
          Вернуться к клубам
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 className="auth-title">Редактировать клуб</h1>

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
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/clubs/${id}`)}
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

export default EditClub;
