import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Университетские клубы
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/clubs" className={isActive('/clubs') ? 'active' : ''}>
              Клубы
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
