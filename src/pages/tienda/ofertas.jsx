import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Ofertas.css';

// Importar las imágenes desde assets
import pelucheKrobus from '../../assets/tienda/peluche-krobus.webp';
import posterGranja from '../../assets/tienda/poster-granja-stardew.avif';
import poleraPersonalizada from '../../assets/tienda/polera-stardew-personalizada.webp';
import almohadaPollo from '../../assets/tienda/almohada-pollo-stardew.png';

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);

  // Datos de ofertas con imágenes importadas
  useEffect(() => {
    const ofertasData = [
      {
        id: 1,
        codigo: "PE001",
        nombre: "Peluche De Krobus",
        descripcion: "Suave y adorable peluche de Krobus, ideal para fans y coleccionistas. ¡Últimas unidades!",
        precioOriginal: 24990,
        precioOferta: 499,
        descuento: 98,
        imagen: pelucheKrobus,
        categoria: "Peluches",
        stock: 3,
        tiempoRestante: "1d 6h 15m",
        exclusivo: true
      },
      {
        id: 2,
        codigo: "DE001",
        nombre: "Póster Stardew Valley (Edición Granja)",
        descripcion: "Póster decorativo de alta calidad con diseño inspirado en la granja de Stardew Valley. ¡Edición especial!",
        precioOriginal: 18990,
        precioOferta: 399,
        descuento: 98,
        imagen: posterGranja,
        categoria: "Decoración",
        stock: 9,
        tiempoRestante: "2d 4h 20m",
        exclusivo: false
      },
      {
        id: 3,
        codigo: "PP001",
        nombre: "Polera Stardew Valley Personalizada (Edición Limitada)",
        descripcion: "Polera de edición limitada con diseño personalizado inspirado en Stardew Valley. ¡No te quedes sin la tuya!",
        precioOriginal: 14990,
        precioOferta: 299,
        descuento: 98,
        imagen: poleraPersonalizada,
        categoria: "Polera Personalizada",
        stock: 12,
        tiempoRestante: "3d 12h 30m",
        exclusivo: true
      },
      {
        id: 4,
        codigo: "DE002",
        nombre: "Almohada Pollo De Stardew Valley",
        descripcion: "Almohada decorativa con forma del icónico pollo de Stardew Valley. ¡Perfecta para tu habitación!",
        precioOriginal: 19990,
        precioOferta: 450,
        descuento: 98,
        imagen: almohadaPollo,
        categoria: "Decoración",
        stock: 29,
        tiempoRestante: "5d 18h 45m",
        exclusivo: false
      }
    ];
    setOfertas(ofertasData);
  }, []);

  const handleAddToCart = (producto) => {
    try {
      const savedCart = localStorage.getItem('junimoCart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      const existingItem = cartItems.find(item => item.codigo === producto.codigo);
      
      let newCartItems;
      if (existingItem) {
        newCartItems = cartItems.map(item =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        newCartItems = [...cartItems, { 
          ...producto, 
          cantidad: 1,
          precio: producto.precioOferta
        }];
      }

      localStorage.setItem('junimoCart', JSON.stringify(newCartItems));
      window.dispatchEvent(new Event('cartUpdated'));
      
      setAlertProduct(producto);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const calcularAhorro = (precioOriginal, precioOferta) => {
    return precioOriginal - precioOferta;
  };

  return (
    <div className="ofertas-page">
      <div className="navbar-spacer"></div>

      {showAlert && alertProduct && (
        <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          ¡{alertProduct.nombre} agregado al carrito por {formatearPrecio(alertProduct.precioOferta)}!
        </Alert>
      )}

      <Container className="py-5">
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
                      <h3>Hasta 21%</h3>
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

        <Row>
          {ofertas.map(oferta => (
            <Col key={oferta.id} xl={3} lg={4} md={6} className="mb-4">
              <Card className="oferta-card h-100">
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
                  alt={oferta.nombre}
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.style.color = '#666';
                    e.target.style.fontSize = '0.8rem';
                    e.target.innerHTML = '🖼️ Imagen no disponible';
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

                    <div className="oferta-stock mb-2">
                      <small className="text-muted">
                        📦 {oferta.stock} unidades disponibles
                      </small>
                    </div>

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
                        to={`/producto/${oferta.codigo}`}
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