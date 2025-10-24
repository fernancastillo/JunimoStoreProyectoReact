

import React from 'react';
import FooterSection from './FooterSection';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer mt-5">
      <div className="footer-sections container">
        {/* Sección de bienvenida */}
        <FooterSection 
          title="¡Bienvenido a Junimo Fanshops!" 
          className="welcome-section"
        >
          <p>
            es una tienda online creada por y para fanáticos del 
            popular juego indie. Ofrecemos merchandising, ropa, accesorios, guías ilustradas y servicios 
            digitales como mods y paquetes de recursos. Realizamos envíos a todo el país y buscamos ser 
            un espacio de encuentro para la comunidad de jugadores.
          </p>
        </FooterSection>

        {/* Sección de menú */}
        <FooterSection title="Menú" className="menu-section">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/carrito">Carrito</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
          </ul>
        </FooterSection>

        {/* Sección de redes sociales */}
        <FooterSection title="Síguenos :D" className="social-section">
          <div className="social-icons">
            <a href="https://github.com/fernancastillo">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://github.com/ScarthPz">
              <i className="bi bi-github"></i>
            </a>
          </div>
          <div className="mt-3">
            <h5>Contáctanos</h5>
            <a 
              href="https://i.pinimg.com/736x/3d/6c/57/3d6c577dc24561124b094681759aa24a.jpg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-light"
            >
              <i className="bi bi-whatsapp fs-3"></i>
            </a>
          </div>
        </FooterSection>
      </div>

      {/* Sección de desarrolladores */}
      <div className="footer-developers text-center mt-4">
        <img 
          src="src/assets/tienda/developed-stardew.png" 
          alt="Developed by Tankator and Ninikyu" 
          className="img-fluid" 
          style={{maxWidth: '350px'}}
        />
      </div>
      
      {/* Pie de página */}
      <div className="footer-bottom">
        <p>&copy; 2025 Todos los derechos reservados. Junimo Fanshop</p>
      </div>
    </footer>
  );
};

export default Footer;