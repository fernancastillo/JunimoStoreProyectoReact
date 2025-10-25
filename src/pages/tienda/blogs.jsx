import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Importar las imágenes locales
import imagenBlog1 from '../../assets/tienda/sv.png';
import imagenBlog2 from '../../assets/tienda/svg.png';

import './Blogs.css';

const Blogs = () => {
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const blogs = [
    {
      id: 1,
      titulo: "Guía Completa de Stardew Valley para Principiantes",
      resumen: "Descubre los secretos para comenzar tu aventura en el valle. Desde la creación de tu granja hasta las relaciones con los habitantes del pueblo.",
      contenido: `
        <h2>¡Bienvenido al Valle!</h2>
        <p>Stardew Valley es más que un simple juego de granja. Es un mundo lleno de secretos, personajes memorables y actividades infinitas. Si acabas de empezar, esta guía te ayudará a evitar errores comunes y maximizar tu diversión.</p>
        
        <h3>📅 Tus Primeros Días</h3>
        <p><strong>Día 1-7:</strong> Enfócate en limpiar un pequeño espacio en tu granja para cultivar. Los <strong>frijoles verdes</strong> y las <strong>papas</strong> son excelentes opciones iniciales.</p>
        <p><strong>Consejo:</strong> No gastes toda tu energía el primer día. Guarda algo para explorar el pueblo.</p>
        
        <h3>🌱 Cultivos por Temporada</h3>
        <ul>
          <li><strong>Primavera:</strong> Fresas (después del Festival del Huevo)</li>
          <li><strong>Verano:</strong> Arándanos (muy rentables)</li>
          <li><strong>Otoño:</strong> Arándanos agrios</li>
        </ul>
        
        <h3>💝 Relaciones con los NPCs</h3>
        <p>Cada personaje tiene gustos únicos. Por ejemplo:</p>
        <ul>
          <li><strong>Abigail:</strong> Amatistas y cuarzo</li>
          <li><strong>Shane:</strong> Pizza y cerveza</li>
          <li><strong>Leah:</strong> Ensalada y vino</li>
        </ul>
        
        <h3>⚒️ Herramientas Básicas</h3>
        <p>Mejora tus herramientas en la herrería en este orden:</p>
        <ol>
          <li>Hacha (para madera)</li>
          <li>Pico (para minerales)</li>
          <li>Regadera (para cultivos más grandes)</li>
        </ol>
        
        <p>¡Recuerda que lo más importante es disfrutar del proceso! No hay una forma "correcta" de jugar Stardew Valley.</p>
      `,
      imagen: imagenBlog1, // Imagen local sv.png
      fecha: "15 de Noviembre, 2024",
      autor: "Junimo Team",
      categoria: "Guías",
      tiempoLectura: "8 min",
      tags: ["principiantes", "guía", "consejos", "granja"]
    },
    {
      id: 2,
      titulo: "Los Secretos Mejor Guardados de Stardew Valley",
      resumen: "Exploramos los easter eggs, lugares secretos y contenido oculto que muchos jugadores se pierden en su primera partida.",
      contenido: `
        <h2>🔍 Secretos del Valle</h2>
        <p>Stardew Valley está lleno de misterios y contenido oculto. Aquí te revelamos algunos de los mejores secretos:</p>
        
        <h3>🎭 El Mercado Negro de los Viernes</h3>
        <p>Cada viernes, visita el camión junto a la casa de Marnie. Allí encontrarás a una misteriosa vendedora que ofrece objetos raros y prohibidos.</p>
        
        <h3>👻 El Fantasma del Cementerio</h3>
        <p>Visita el cementerio en la noche del día 1 de cada temporada. Si tienes suerte, podrás ver una aparición fantasmagórica.</p>
        
        <h3>🗝️ La Cueva del Bosque Secret</h3>
        <p>En el noroeste del Bosque Ceniciento, hay un tronco grande que puedes romper con un hacha de acero. Detrás encontrarás una cueva secreta con recursos únicos.</p>
        
        <h3>🎮 Referencias a Otros Juegos</h3>
        <ul>
          <li>En la biblioteca, busca el libro "El Príncipe de los Guisantes"</li>
          <li>El nombre "Junimo" es un homenaje a los espíritus del bosque</li>
          <li>Las minas tienen referencias a juegos de rol clásicos</li>
        </ul>
        
        <h3>💎 La Espada Galaxy</h3>
        <p>Para obtener esta poderosa arma:</p>
        <ol>
          <li>Llega al nivel 120 de las minas</li>
          <li>Consigue una barra de iridio</li>
          <li>Ofrécesela al altar en el desierto</li>
        </ol>
        
        <h3>🎨 Arte Oculto</h3>
        <p>Algunos cuadros en las casas de los NPCs cambian según eventos especiales. Presta atención a los detalles.</p>
        
        <h3>🐔 La Gallina de Oro</h3>
        <p>Existe una pequeña posibilidad de que una gallina ponga un huevo de oro. ¡Es extremadamente raro!</p>
        
        <p>¿Conoces algún otro secreto? ¡Compártelo en los comentarios!</p>
      `,
      imagen: imagenBlog2, // Imagen local svg.png
      fecha: "10 de Noviembre, 2024",
      autor: "Granjero Experto",
      categoria: "Secretos",
      tiempoLectura: "12 min",
      tags: ["secretos", "easter eggs", "contenido oculto", "misterios"]
    }
  ];

  const handleSuscribir = (e) => {
    e.preventDefault();
    
    if (!email) {
      setAlertMessage('❌ Por favor ingresa tu email');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!validarEmail(email)) {
      setAlertMessage('❌ Por favor ingresa un email válido');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    // Simular suscripción
    console.log('Email suscrito:', email);
    
    setAlertMessage('✅ ¡Te has suscrito exitosamente! Revisa tu email para confirmar.');
    setShowAlert(true);
    setEmail('');
    
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleLeerArticulo = (blogId) => {
    // Por ahora mostrar el contenido en un alert, luego puedes crear páginas individuales
    const blog = blogs.find(b => b.id === blogId);
    
    // Crear una ventana modal simple con el contenido
    const modalContent = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center;">
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 800px; max-height: 80vh; overflow-y: auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2E8B57; margin-bottom: 1rem;">${blog.titulo}</h2>
          <div style="color: #333; line-height: 1.6;">${blog.contenido}</div>
          <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2E8B57; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
        </div>
      </div>
    `;
    
    // Crear y mostrar el modal
    const modal = document.createElement('div');
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="blogs-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      {/* Alert de notificación */}
      {showAlert && (
        <Alert 
          variant={alertMessage.includes('✅') ? 'success' : 'danger'} 
          className="position-fixed top-0 start-50 translate-middle-x mt-5" 
          style={{ zIndex: 1050, minWidth: '300px' }}
        >
          {alertMessage}
        </Alert>
      )}

      <Container className="py-5">
        {/* HEADER PRINCIPAL */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="blogs-titulo-principal">Blog de Stardew Valley</h1>
              <p className="blogs-subtitulo">
                Descubre consejos, guías y secretos del valle
              </p>
            </div>
          </Col>
        </Row>

        {/* LISTA DE BLOGS */}
        <Row>
          {blogs.map(blog => (
            <Col key={blog.id} lg={6} className="mb-4">
              <Card className="blog-card h-100">
                <div className="blog-imagen-container">
                  <Card.Img 
                    variant="top" 
                    src={blog.imagen} 
                    className="blog-imagen"
                    onError={(e) => {
                      console.error('Error cargando imagen:', blog.imagen);
                      e.target.src = 'https://via.placeholder.com/600x400/2E8B57/FFFFFF?text=Imagen+No+Disponible';
                    }}
                  />
                  <Badge bg="success" className="blog-categoria-badge">
                    {blog.categoria}
                  </Badge>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <div className="blog-meta mb-2">
                    <small className="text-muted">
                      📅 {blog.fecha} • ⏱️ {blog.tiempoLectura} • ✍️ {blog.autor}
                    </small>
                  </div>
                  
                  <Card.Title className="blog-titulo">
                    {blog.titulo}
                  </Card.Title>
                  
                  <Card.Text className="blog-resumen">
                    {blog.resumen}
                  </Card.Text>
                  
                  <div className="blog-tags mb-3">
                    {blog.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        bg="outline-success" 
                        className="blog-tag me-1"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      className="blog-btn-leer"
                      onClick={() => handleLeerArticulo(blog.id)}
                    >
                      📖 Leer Artículo Completo
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* NEWSLETTER */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <Card className="blog-newsletter-card">
              <Card.Body className="p-4 text-center">
                <h3 className="blogs-titulo-seccion">📧 Suscríbete a Nuestro Blog</h3>
                <p className="blogs-texto">
                  Recibe las últimas guías, noticias y secretos de Stardew Valley directamente en tu email.
                </p>
                <form onSubmit={handleSuscribir} className="d-flex gap-2 justify-content-center">
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    className="blog-newsletter-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" className="blog-btn-suscribir">
                    Suscribirse
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* BOTÓN VOLVER A TIENDA */}
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/productos" className="btn btn-outline-warning btn-lg">
              🛍️ Volver a la Tienda
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blogs;