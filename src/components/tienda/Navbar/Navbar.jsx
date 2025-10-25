import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { authService } from '../../../utils/tienda/authService';
import junimoLogo from '../../../assets/tienda/junimoss.png';
import loginIcon from '../../../assets/tienda/registrarse.png';
import polloPerfil from '../../../assets/tienda/polloperfil.png'; 
import './Navbar.css';

const CustomNavbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'index', label: 'Home', path: '/index' },
    { id: 'categorias', label: 'Categorías', path: '/productos' },
    { id: 'ofertas', label: 'Ofertas', path: '/ofertas' },
    { id: 'nosotros', label: 'Nosotros', path: '/nosotros' },
    { id: 'blog', label: 'Blog', path: '/blogs' },
    { id: 'contacto', label: 'Contacto', path: '/contacto' }
  ];

  const getCartItemCount = () => {
    const savedCart = localStorage.getItem('junimoCart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      return cartItems.reduce((total, item) => total + item.cantidad, 0);
    }
    return 0;
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setCartItemCount(getCartItemCount());
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCartItemCount(getCartItemCount());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/index');
  };

  const navbarStyle = {
    background: `linear-gradient(135deg, rgba(46, 139, 87, 0.85) 0%, rgba(67, 160, 71, 0.85) 100%), url('/img/fondostardew.png') center/cover`,
    backgroundBlendMode: 'overlay'
  };

  return (
    <Navbar expand="lg" className="custom-navbar" style={navbarStyle} fixed="top">
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/index" className="d-flex align-items-center">
          <div className="logo-container me-2">
            <img src={junimoLogo} alt="Logo Junimo" className="logo-image" />
          </div>
          <span className="logo-text">Junimo Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.id}
                as={Link}
                to={item.path}
                className={`nav-menu-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
                {item.id === 'ofertas' && <span className="hot-badge ms-1">HOT</span>}
              </Nav.Link>
            ))}
          </Nav>

          <Nav className="align-items-center">
            {/* Carrito con contador actualizado */}
            <Nav.Link as={Link} to="/carrito" className="nav-action-btn position-relative me-3">
              <span className="action-icon">🛒</span>
              {cartItemCount > 0 && (
                <span className="cart-count-badge">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Nav.Link>

            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle as="div" className="user-profile-btn cursor-pointer">
                  <div className="d-flex align-items-center">
                    <img src={polloPerfil} alt="Perfil" className="user-avatar me-2" />
                    <span className="user-name d-none d-md-block">{currentUser.nombre}</span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-dropdown-menu">
                  <div className="user-info p-3">
                    <img src={polloPerfil} alt="Perfil" className="user-avatar-large me-3" />
                    <div className="user-details">
                      <strong>{currentUser.nombre} {currentUser.apellido}</strong>
                      <span className="d-block">{currentUser.email}</span>
                      {currentUser.descuento && currentUser.descuento !== '0%' && (
                        <span className="user-discount">🎓 {currentUser.descuento} descuento</span>
                      )}
                    </div>
                  </div>
                  
                  <Dropdown.Item as={Link} to="/perfil" className="dropdown-link">
                    <span className="dropdown-icon me-2">👤</span>
                    Mi Perfil
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/pedidos" className="dropdown-link">
                    <span className="dropdown-icon me-2">📦</span>
                    Mis Pedidos
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="dropdown-link logout-btn">
                    <span className="dropdown-icon me-2">🚪</span>
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="login-btn-large">
                <img src={loginIcon} alt="Iniciar Sesión" className="login-icon-large" />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;