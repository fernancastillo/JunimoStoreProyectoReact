import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Estilos para los hover
  const navLinkStyle = {
    transition: 'all 0.3s ease',
  };

  const navLinkHoverStyle = {
    backgroundColor: '#87CEEB',
    color: '#000000',
    borderRadius: '5px'
  };

  const buttonHoverStyle = {
    backgroundColor: '#87CEEB',
    color: '#000000',
    borderColor: '#87CEEB'
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#dedd8ff5' }}>
      <div className="container-fluid">
        {/* Logo/Brand */}
        <Link className="navbar-brand fw-bold ms-3 text-dark" to="/index">
          Mi Tienda
        </Link>

        {/* Botón hamburguesa para móviles */}
        <button 
          className="navbar-toggler me-3 border-dark" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
            <li className="nav-item">
              <Link 
                to="/index" 
                className={`nav-link text-dark ${location.pathname === '/index' ? 'active fw-bold' : ''}`}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/index') {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/index') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/productos" 
                className={`nav-link text-dark ${location.pathname === '/productos' ? 'active fw-bold' : ''}`}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/productos') {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/productos') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/ofertas" 
                className={`nav-link text-dark ${location.pathname === '/ofertas' ? 'active fw-bold' : ''}`}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/ofertas') {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/ofertas') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                Ofertas
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/blogs" 
                className={`nav-link text-dark ${location.pathname === '/blogs' ? 'active fw-bold' : ''}`}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/blogs') {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/blogs') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/nosotros" 
                className={`nav-link text-dark ${location.pathname === '/nosotros' ? 'active fw-bold' : ''}`}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/nosotros') {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/nosotros') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contacto" 
                className={`nav-link text-dark ${location.pathname === '/contacto' ? 'active fw-bold' : ''}`}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/contacto') {
                    e.target.style.backgroundColor = '#87CEEB';
                    e.target.style.color = '#000000';
                    e.target.style.borderRadius = '5px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/contacto') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                Contacto
              </Link>
            </li>
          </ul>

          {/* Iconos del lado derecho */}
          <div className="d-flex align-items-center me-3">
            <Link 
              to="/carrito" 
              className="btn btn-outline-dark me-2"
              style={{ transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#87CEEB';
                e.target.style.color = '#000000';
                e.target.style.borderColor = '#87CEEB';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#000000';
                e.target.style.borderColor = '#000000';
              }}
            >
              <i className="bi bi-cart3"></i>
              <span className="ms-1 d-none d-sm-inline">Carrito</span>
            </Link>
            <Link 
              to="/login" 
              className="btn btn-dark text-white"
              style={{ transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#87CEEB';
                e.target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#000000';
                e.target.style.color = '#ffffff';
              }}
            >
              <i className="bi bi-person"></i>
              <span className="ms-1 d-none d-sm-inline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;