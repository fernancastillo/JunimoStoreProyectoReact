import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container>
        {/* Secciones principales */}
        <Row className="footer-sections gy-4">
          {/* Sección de bienvenida */}
          <Col lg={6} md={12}>
            <div className="footer-section welcome-section">
              <h5>¡Bienvenido a Junimo Fanshops!</h5>
              <p className="footer-description">
                Es una tienda online creada por y para fanáticos del popular juego indie. 
                Ofrecemos merchandising, ropa, accesorios, guías ilustradas y servicios 
                digitales como mods y paquetes de recursos. Realizamos envíos a todo el 
                país y buscamos ser un espacio de encuentro para la comunidad de jugadores.
              </p>
            </div>
          </Col>

          {/* Sección de menú */}
          <Col lg={3} md={6}>
            <div className="footer-section menu-section">
              <h5>Menú</h5>
              <ul className="footer-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/carrito">Carrito</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
              </ul>
            </div>
          </Col>

          {/* Sección de redes sociales */}
          <Col lg={3} md={6}>
            <div className="footer-section social-section">
              <h5>Síguenos :D</h5>
              <div className="social-icons">
                <a href="https://github.com/fernancastillo" aria-label="GitHub Fernan">
                  <i className="bi bi-github"></i>
                </a>
                <a href="https://github.com/ScarthPz" aria-label="GitHub Scarth">
                  <i className="bi bi-github"></i>
                </a>
              </div>
              
              <div className="contact-section mt-3">
                <h6>Contáctanos</h6>
                <a 
                  href="https://i.pinimg.com/736x/3d/6c/57/3d6c577dc24561124b094681759aa24a.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                  aria-label="Contactar por WhatsApp"
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>

        {/* Sección de desarrolladores */}
        <Row className="mt-4">
          <Col className="text-center">
            <div className="footer-developers">
              <img 
                src="src/assets/tienda/developed-stardew.png" 
                alt="Developed by Tankator and Ninikyu" 
                className="developer-image img-fluid"
              />
            </div>
          </Col>
        </Row>
        
        {/* Pie de página */}
        <Row className="mt-4">
          <Col>
            <div className="footer-bottom text-center">
              <p>&copy; 2025 Todos los derechos reservados. Junimo Fanshop</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;