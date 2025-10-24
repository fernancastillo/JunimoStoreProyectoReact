import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import junimoLogo from '../../../assets/tienda/junimoss.png';
import loginIcon from '../../../assets/tienda/registrarse.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: 'index', label: 'Home', path: '/index' },
    { id: 'categorias', label: 'Categorías', path: '/productos' },
    { id: 'ofertas', label: 'Ofertas', path: '/ofertas' },
    { id: 'nosotros', label: 'Nosotros', path: '/nosotros' },
    { id: 'blog', label: 'Blog', path: '/blogs' },
    { id: 'contacto', label: 'Contacto', path: '/contacto' }
  ];

  // Ruta para el fondo desde public
  const navbarBackground = '/img/fondostardew.png';

  const navbarStyle = {
    background: `linear-gradient(135deg, rgba(46, 139, 87, 0.85) 0%, rgba(67, 160, 71, 0.85) 100%), url(${navbarBackground}) center/cover`,
    backgroundBlendMode: 'overlay'
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar-tienda" style={navbarStyle}>
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/index" className="nav-logo">
            <div className="logo-container">
              <img src={junimoLogo} alt="Logo Junimo" className="logo-image" />
            </div>
            <span className="logo-text">Junimo Store</span>
          </Link>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-label">{item.label}</span>
                {item.id === 'ofertas' && <span className="hot-badge">HOT</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link to="/carrito" className="nav-action-btn" aria-label="Carrito">
            <span className="action-icon">🛒</span>
            <span className="cart-count">3</span>
          </Link>
          
          
           <Link to="/login" className="login-btn-large" aria-label="Iniciar Sesión">
            <img src={loginIcon} alt="Iniciar Sesión" className="login-icon-large" />
           </Link>

        </div>

        <div 
          className={`nav-hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </div>
      </div>

      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;