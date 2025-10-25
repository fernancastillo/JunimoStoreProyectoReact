import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Ofertas.css';

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);

  // Simular datos de ofertas (en una app real vendrían de una API)
  useEffect(() => {
    const ofertasData = [
      {
        id: 1,
        nombre: "Pack Completo Stardew Valley",
        descripcion: "Incluye guía física, peluche Junimo y mapa del valle. ¡Todo lo que necesitas para comenzar!",
        precioOriginal: 45000,
        precioOferta: 34990,
        descuento: 22,
        imagen: "https://via.placeholder.com/400x300/2E8B57/FFFFFF?text=Pack+Completo",
        categoria: "Packs",
        stock: 15,
        tiempoRestante: "3d 12h 30m",
        exclusivo: true
      },
      {
        id: 2,
        nombre: "Peluche Junimo Gigante",
        descripcion: "Peluche extra grande de 40cm del adorable Junimo. ¡Edición limitada!",
        precioOriginal: 29990,
        precioOferta: 19990,
        descuento: 33,
        imagen: "https://via.placeholder.com/400x300/FFD700/000000?text=Junimo+Gigante",
        categoria: "Peluches",
        stock: 8,
        tiempoRestante: "1d 6h 15m",
        exclusivo: true
      },
      {
        id: 3,
        nombre: "Guía Estratégica Premium",
        descripcion: "Guía completa con todos los secretos, mapas y estrategias avanzadas.",
        precioOriginal: 24990,
        precioOferta: 17990,
        descuento: 28,
        imagen: "https://via.placeholder.com/400x300/87CEEB/FFFFFF?text=Guía+Premium",
        categoria: "Guías",
        stock: 20,
        tiempoRestante: "5d 18h 45m",
        exclusivo: false
      },
      {
        id: 4,
        nombre: "Set de Accesorios Mineros",
        descripcion: "Incluye pico decorativo, casco y lámpara de minero. Perfecto para fans de las minas.",
        precioOriginal: 35990,
        precioOferta: 27990,
        descuento: 22,
        imagen: "https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Set+Minería",
        categoria: "Accesorios",
        stock: 12,
        tiempoRestante: "2d 4h 20m",
        exclusivo: false
      }
    ];
    setOfertas(ofertasData);
  }, []);

  const handleAddToCart = (producto) => {
    const savedCart = localStorage.getItem('junimoCart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cartItems.find(item => item.id === producto.id);
    
    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      newCartItems = [...cartItems, { 
        ...producto, 
        cantidad: 1,
        precio: producto.precioOferta // Usar precio de oferta en el carrito
      }];
    }

    localStorage.setItem('junimoCart', JSON.stringify(newCartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setAlertProduct(producto);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const calcularAhorro = (precioOriginal, precioOferta) => {
    return precioOriginal - precioOferta;
  };

  return (
    <div className="ofertas-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      {/* Alert de producto agregado */}
      {showAlert && alertProduct && (
        <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          ¡{alertProduct.nombre} agregado al carrito por {formatearPrecio(alertProduct.precioOferta)}!
        </Alert>
      )}

      <Container className="py-5">
        {/* HEADER PRINCIPAL */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="ofertas-titulo-principal">🔥 Ofertas Especiales</h1>
              <p className="ofertas-subtitulo">
                Descuentos exclusivos por tiempo limitado
              </p>
              <Badge bg="danger" className="ofertas-contador-global">
                ⏰ Ofertas terminan pronto
              </Badge>
            </div>
          </Col>
        </Row>

        {/* CONTADOR DE OFERTAS */}
        <Row className="mb-4">
          <Col>
            <Card className="ofertas-info-card">
              <Card.Body className="text-center p-3">
                <h4 className="ofertas-titulo-seccion mb-3">🎁 ¡Aprovecha estas ofertas!</h4>
                <Row>
                  <Col md={4}>
                    <div className="ofertas-stats">
                      <h3>{ofertas.length}</h3>
                      <p>Ofertas Activas</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="ofertas-stats">
                      <h3>Hasta 33%</h3>
                      <p>Descuento</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="ofertas-stats">
                      <h3>🕒</h3>
                      <p>Tiempo Limitado</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* LISTA DE OFERTAS */}
        <Row>
          {ofertas.map(oferta => (
            <Col key={oferta.id} xl={3} lg={4} md={6} className="mb-4">
              <Card className="oferta-card h-100">
                {/* Badge de oferta */}
                <div className="oferta-badge-container">
                  <Badge bg="danger" className="oferta-descuento-badge">
                    -{oferta.descuento}%
                  </Badge>
                  {oferta.exclusivo && (
                    <Badge bg="warning" text="dark" className="oferta-exclusivo-badge">
                      ⭐ Exclusivo
                    </Badge>
                  )}
                  <Badge bg="secondary" className="oferta-tiempo-badge">
                    ⏰ {oferta.tiempoRestante}
                  </Badge>
                </div>

                <Card.Img 
                  variant="top" 
                  src={oferta.imagen} 
                  className="oferta-imagen"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/2E8B57/FFFFFF?text=Oferta+Especial';
                  }}
                />
                
                <Card.Body className="d-flex flex-column">
                  <Badge bg="success" className="mb-2 align-self-start">
                    {oferta.categoria}
                  </Badge>
                  
                  <Card.Title className="oferta-titulo">
                    {oferta.nombre}
                  </Card.Title>
                  
                  <Card.Text className="oferta-descripcion">
                    {oferta.descripcion}
                  </Card.Text>
                  
                  <div className="mt-auto">
                    {/* Precios */}
                    <div className="oferta-precios mb-2">
                      <div className="precio-original text-muted text-decoration-line-through">
                        {formatearPrecio(oferta.precioOriginal)}
                      </div>
                      <div className="precio-oferta">
                        {formatearPrecio(oferta.precioOferta)}
                      </div>
                      <div className="ahorro text-success">
                        Ahorras: {formatearPrecio(calcularAhorro(oferta.precioOriginal, oferta.precioOferta))}
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="oferta-stock mb-2">
                      <small className="text-muted">
                        📦 {oferta.stock} unidades disponibles
                      </small>
                    </div>

                    {/* Botones */}
                    <div className="d-grid gap-2">
                      <Button 
                        variant="warning" 
                        className="oferta-btn-comprar"
                        onClick={() => handleAddToCart(oferta)}
                        disabled={oferta.stock === 0}
                      >
                        {oferta.stock === 0 ? '❌ AGOTADO' : '🛒 AGREGAR AL CARRITO'}
                      </Button>
                      
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        as={Link}
                        to={`/producto/${oferta.id}`}
                        className="oferta-btn-detalles"
                      >
                        👁️ Ver Detalles
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* NEWSLETTER OFERTAS */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <Card className="ofertas-newsletter-card">
              <Card.Body className="p-4 text-center">
                <h3 className="ofertas-titulo-seccion">💌 Sé el Primero en Enterarte</h3>
                <p className="ofertas-texto">
                  Suscríbete y recibe alertas exclusivas de ofertas antes que nadie. 
                  <strong> ¡Plus: 10% de descuento en tu primera compra!</strong>
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    className="ofertas-newsletter-input"
                  />
                  <Button className="ofertas-btn-suscribir">
                    Suscribirme a Ofertas
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/productos" className="btn btn-outline-warning btn-lg">
              🛍️ Ver Todos los Productos
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Ofertas;