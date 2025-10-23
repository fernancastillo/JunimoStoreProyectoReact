import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#dedd8ff5' }}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand fw-bold ms-3 text-dark" to="/index">
          Junimo Store
        </Link>

        {/* Botón hamburguesa para móviles */}
        <button 
          className="navbar-toggler me-3 border-dark btn-hover-effect"
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
            {['/index', '/productos', '/ofertas', '/blogs', '/nosotros', '/contacto'].map((path) => (
              <li key={path} className="nav-item">
                <Link 
                  to={path} 
                  className={`nav-link text-dark ${location.pathname === path ? 'active fw-bold' : ''}`}
                  style={{ 
                    backgroundColor: location.pathname === path ? '#c9c87ae5' : 'transparent' 
                  }}
                >
                  {path === '/index' && 'Inicio'}
                  {path === '/productos' && 'Productos'}
                  {path === '/ofertas' && 'Ofertas'}
                  {path === '/blogs' && 'Blog'}
                  {path === '/nosotros' && 'Nosotros'}
                  {path === '/contacto' && 'Contacto'}
                </Link>
              </li>
            ))}
          </ul>

          {/* Iconos del lado derecho */}
          <div className="d-flex align-items-center me-3">
            <Link 
              to="/carrito" 
              className="btn btn-outline-dark me-2 btn-hover-effect"
            >
              <i className="bi bi-cart3"></i>
              <span className="ms-1 d-none d-sm-inline">Carrito</span>
            </Link>
            <Link 
              to="/login" 
              className="btn btn-dark text-white btn-hover-effect"
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