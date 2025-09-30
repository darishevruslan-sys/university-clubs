import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Университетские клубы
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link 
              to="/clubs" 
              className={isActive('/clubs') ? 'active' : ''}
            >
              Клубы
            </Link>
          </li>
          {user && (
            <li>
              <Link 
                to="/create-club" 
                className={isActive('/create-club') ? 'active' : ''}
              >
                Создать клуб
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </div>
              <Link to="/profile" className="btn btn-outline btn-sm">
                Профиль
              </Link>
              <button 
                onClick={logout} 
                className="btn btn-secondary btn-sm"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Войти
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
