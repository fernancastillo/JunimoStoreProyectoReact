import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/ordenes', icon: 'bi bi-cart-check', label: 'Órdenes' },
    { path: '/admin/productos', icon: 'bi bi-box-seam', label: 'Productos' },
    { path: '/admin/usuarios', icon: 'bi bi-people', label: 'Usuarios' },
    { path: '/admin/perfil', icon: 'bi bi-person', label: 'Perfil' },
  ];

  // Estilo para hover
  const linkHoverStyle = {
    backgroundColor: '#87CEEB',
    color: '#000000',
    borderRadius: '5px',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="min-vh-100 w-100" style={{ backgroundColor: '#dedd8ff5' }}>
      <div className="sidebar-sticky">          
        {/* Header compacto */}
        <div className="p-2 text-center" style={{ backgroundColor: '#c9c87ae5' }}>
          <h6 className="mb-0 small text-dark">Admin</h6>
        </div>
        
        <ul className="nav nav-pills flex-column p-2">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <Link 
                to={item.path} 
                className={`nav-link text-dark d-flex flex-column align-items-center p-2 ${
                  location.pathname === item.path ? 'active fw-bold' : ''
                }`}
                style={{ 
                  backgroundColor: location.pathname === item.path ? '#c9c87ae5' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = location.pathname === item.path ? '#c9c87ae5' : 'transparent';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '0px';
                  }
                }}
                title={item.label}
              >
                <i className={`${item.icon} fs-5`}></i>
                <small className="mt-1" style={{ fontSize: '0.7rem' }}>{item.label}</small>
              </Link>
            </li>
          ))}
          
          <li className="nav-item mt-3 pt-3 border-top border-dark">
            <Link 
              to="/index" 
              className="nav-link text-dark d-flex flex-column align-items-center p-2 fw-bold"
              style={{ transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#87CEEB';
                e.target.style.color = '#000000';
                e.target.style.borderRadius = '5px';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#000000';
                e.target.style.borderRadius = '0px';
              }}
              title="Volver a Tienda"
            >
              <i className="bi bi-shop fs-5"></i>
              <small className="mt-1" style={{ fontSize: '0.7rem' }}>Tienda</small>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

// ✅ COMPONENTE SEPARADO para el navbar móvil
export const AdminMobileNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);

  const menuItems = [
    { path: '/admin/dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/ordenes', icon: 'bi bi-cart-check', label: 'Órdenes' },
    { path: '/admin/productos', icon: 'bi bi-box-seam', label: 'Productos' },
    { path: '/admin/usuarios', icon: 'bi bi-people', label: 'Usuarios' },
    { path: '/admin/perfil', icon: 'bi bi-person', label: 'Perfil' },
  ];

  // Estilo para hover en móvil
  const mobileLinkHoverStyle = {
    backgroundColor: '#87CEEB',
    color: '#000000',
    transition: 'all 0.3s ease'
  };

  // ✅ Cerrar menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div ref={navbarRef}>
      {/* ✅ Navbar móvil - CON COLOR AMARILLO MOSTAZA */}
      <nav className="navbar navbar-dark d-md-none fixed-top" style={{ 
        backgroundColor: '#dedd8ff5',
        minHeight: '56px'
      }}>
        <div className="container-fluid">
          <span className="navbar-brand text-dark fw-bold">Panel Admin</span>
          <button 
            className="navbar-toggler border-dark" 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#87CEEB';
              e.target.style.borderColor = '#87CEEB';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#000000';
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* ✅ Menú móvil desplegable - POSICIONADO CORRECTAMENTE */}
      {isMobileMenuOpen && (
        <div 
          className="d-md-none" 
          style={{ 
            position: 'fixed', 
            top: '56px', // ✅ Justo debajo del navbar
            left: 0, 
            right: 0, 
            zIndex: 1050,
            backgroundColor: '#dedd8ff5',
            borderTop: '1px solid #c9c87ae5',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <ul className="nav nav-pills flex-column p-3 m-0">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <Link 
                  to={item.path} 
                  className={`nav-link text-dark d-flex align-items-center py-3 ${
                    location.pathname === item.path ? 'active fw-bold' : ''
                  }`}
                  style={{ 
                    backgroundColor: location.pathname === item.path ? '#c9c87ae5' : 'transparent',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.backgroundColor = '#87CEEB';
                      e.target.style.color = '#000000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#000000';
                    } else {
                      e.target.style.backgroundColor = '#c9c87ae5';
                      e.target.style.color = '#000000';
                    }
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`${item.icon} me-3 fs-5`}></i>
                  <span className="fs-6">{item.label}</span>
                </Link>
              </li>
            ))}
            
            <li className="nav-item mt-3 pt-3 border-top border-dark">
              <Link 
                to="/index" 
                className="nav-link text-dark d-flex align-items-center py-3 fw-bold"
                style={{ 
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#87CEEB';
                  e.target.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#000000';
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="bi bi-shop me-3 fs-5"></i>
                <span className="fs-6">Volver a Tienda</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;