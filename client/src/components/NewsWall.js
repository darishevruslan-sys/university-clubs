import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const NewsWall = ({ clubId }) => {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, [clubId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNews = async () => {
    try {
      const response = await axios.get(`/api/clubs/${clubId}/news`);
      setNews(response.data.news);
    } catch (error) {
      setError('Ошибка при загрузке новостей');
      console.error('Ошибка при загрузке новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('ru-RU', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  if (!user) {
    return (
      <div className="news-wall-container">
        <div className="news-wall-header">
          <h3>Стена новостей</h3>
        </div>
        <div className="news-placeholder">
          <p>Войдите в систему, чтобы видеть новости клуба</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-wall-container">
      <div className="news-wall-header">
        <h3>Стена новостей</h3>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary btn-sm"
        >
          {showCreateForm ? 'Отмена' : 'Опубликовать новость'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ margin: '16px' }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <CreateNewsForm 
          clubId={clubId} 
          onSuccess={() => {
            setShowCreateForm(false);
            fetchNews();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="news-list">
        {loading ? (
          <div className="news-loading">
            <div className="spinner"></div>
            <p>Загрузка новостей...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="news-placeholder">
            <p>Пока нет новостей. Будьте первым, кто опубликует новость!</p>
          </div>
        ) : (
          news.map((newsItem) => (
            <NewsItem 
              key={newsItem._id} 
              news={newsItem} 
              currentUser={user}
              onUpdate={fetchNews}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Component for creating news
const CreateNewsForm = ({ clubId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Можно загрузить максимум 5 изображений');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Заголовок и содержание обязательны');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      await axios.post(`/api/clubs/${clubId}/news`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({ title: '', content: '' });
      setImages([]);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при публикации новости');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-form">
      <h4>Опубликовать новость</h4>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Заголовок *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Введите заголовок новости"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Содержание *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="form-input"
            rows="4"
            placeholder="Опишите новость..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images" className="form-label">
            Изображения (максимум 5)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            className="form-input"
            multiple
            accept="image/*"
          />
          {images.length > 0 && (
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="preview-item">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                  />
                  <span className="preview-name">{image.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

// Component for displaying individual news item
const NewsItem = ({ news, currentUser, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = news.author._id === currentUser.id;

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`/api/news/${news._id}`);
      onUpdate();
    } catch (error) {
      console.error('Ошибка при удалении новости:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="news-item">
      <div className="news-header">
        <div className="news-author">
          <div className="news-avatar">
            {news.author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="news-author-name">{news.author.name}</div>
            <div className="news-date">{formatDate(news.createdAt)}</div>
          </div>
        </div>
        {isAuthor && (
          <div className="news-actions">
            <button 
              onClick={() => setShowEditForm(!showEditForm)}
              className="btn btn-outline btn-sm"
            >
              Редактировать
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-danger btn-sm"
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        )}
      </div>

      <div className="news-content">
        <h4 className="news-title">{news.title}</h4>
        <p className="news-text">{news.content}</p>
        
        {news.images && news.images.length > 0 && (
          <div className="news-images">
            {news.images.map((image, index) => (
              <img 
                key={index}
                src={`http://localhost:5000/uploads/${image}`}
                alt={`Изображение ${index + 1}`}
                className="news-image"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsWall;
