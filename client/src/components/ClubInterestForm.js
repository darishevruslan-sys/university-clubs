import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'clubInterestSubmissions';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    window.localStorage.setItem('__storage_test__', '1');
    window.localStorage.removeItem('__storage_test__');
    return window.localStorage;
  } catch (error) {
    try {
      window.sessionStorage.setItem('__storage_test__', '1');
      window.sessionStorage.removeItem('__storage_test__');
      return window.sessionStorage;
    } catch (err) {
      return null;
    }
  }
};

const directions = [
  { value: 'technology', label: 'Технологии и программирование' },
  { value: 'arts', label: 'Творчество и искусство' },
  { value: 'science', label: 'Наука и исследования' },
  { value: 'volunteering', label: 'Волонтерство и социальные проекты' },
  { value: 'sports', label: 'Спорт и активный отдых' },
];

const initialFormData = {
  fullName: '',
  email: '',
  direction: '',
  comment: '',
};

const ClubInterestForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submissions, setSubmissions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const storageRef = useRef(null);

  useEffect(() => {
    storageRef.current = getStorage();

    if (storageRef.current) {
      try {
        const saved = storageRef.current.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSubmissions(parsed);
          }
        }
      } catch (error) {
        console.error('Не удалось загрузить заявки из хранилища', error);
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedComment = formData.comment.trim();
    setSuccessMessage('');

    if (!trimmedName || !trimmedEmail || !formData.direction) {
      return;
    }

    const newSubmission = {
      id: Date.now(),
      fullName: trimmedName,
      email: trimmedEmail,
      direction: formData.direction,
      comment: trimmedComment,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prevSubmissions) => {
      const updated = [newSubmission, ...prevSubmissions].slice(0, 5);

      if (storageRef.current) {
        try {
          storageRef.current.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Не удалось сохранить заявку в хранилище', error);
        }
      }

      return updated;
    });
    setFormData(initialFormData);
    setSuccessMessage('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <section className="interest-form">
      <div className="container">
        <div className="interest-form__inner">
          <div className="interest-form__content">
            <h2 className="section-title">Оставьте заявку на участие</h2>
            <p>
              Расскажите о себе и выберите направление, которое вам интересно.
              Мы передадим вашу заявку лидеру клуба, чтобы он связался с вами и
              рассказал подробности.
            </p>
          </div>

          <div className="interest-form__layout">
            <form onSubmit={handleSubmit} className="card">
              <div className="form-field">
                <label htmlFor="fullName">ФИО</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Почта</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-field">
                <label htmlFor="direction">Выбранное направление</label>
                <select
                  id="direction"
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                >
                  <option value="">Выберите направление</option>
                  {directions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="comment">Свободный комментарий</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Расскажите о своих интересах, опыте и ожиданиях"
                  rows={4}
                />
              </div>

              {successMessage && <div className="form-success">{successMessage}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Отправить заявку
                </button>
              </div>
            </form>

            {submissions.length > 0 && (
              <div className="recent-submissions card">
                <h3>Последние заявки</h3>
                <ul className="submission-list">
                  {submissions.map((submission) => {
                    const directionLabel =
                      directions.find((item) => item.value === submission.direction)?.label ||
                      submission.direction;
                    return (
                      <li key={submission.id} className="submission-item">
                        <strong>{submission.fullName}</strong>
                        <span>{submission.email}</span>
                        <span>{directionLabel}</span>
                        {submission.comment && <p>{submission.comment}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubInterestForm;
