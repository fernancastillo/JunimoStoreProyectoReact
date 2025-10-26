import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Form } from 'react-bootstrap';
import productosData from '../../data/productos.json';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const productoEncontrado = productosData.find(p => p.codigo === codigo);
    
    if (productoEncontrado) {
      setProduct(productoEncontrado);
      // Obtener productos relacionados (misma categoría)
      const relacionados = productosData
        .filter(p => p.categoria === productoEncontrado.categoria && p.codigo !== codigo)
        .slice(0, 4);
      setRelatedProducts(relacionados);
    } else {
      navigate('/productos');
    }
  }, [codigo, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    const savedCart = localStorage.getItem('junimoCart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cartItems.find(item => item.codigo === product.codigo);
    
    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.codigo === product.codigo
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      newCartItems = [...cartItems, { ...product, cantidad: cantidad }];
    }

    localStorage.setItem('junimoCart', JSON.stringify(newCartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const categoryIcons = {
    'Accesorios': '🔑',
    'Decoración': '🏠',
    'Peluches': '🧸',
    'Guías': '📚',
    'Mods Digitales': '💻',
    'Polera Personalizada': '👕',
    'Juego De Mesa': '🎲'
  };

  if (!product) {
    return (
      <div className="producto-detalle-page">
        <div className="navbar-spacer"></div>
        <Container className="text-center py-5">
          <div className="loading-state">
            <span className="loading-icon">🌾</span>
            <h4 className="text-white mt-3">Cargando producto...</h4>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="producto-detalle-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      {/* Alert de producto agregado */}
      {showAlert && (
        <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          ¡{product.nombre} agregado al carrito!
        </Alert>
      )}

      <Container className="py-4">
        {/* Breadcrumb */}
        <Row className="mb-4">
          <Col>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb-custom">
                <li className="breadcrumb-item">
                  <Link to="/" className="breadcrumb-link">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/productos" className="breadcrumb-link">Productos</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">{product.nombre}</li>
              </ol>
            </nav>
          </Col>
        </Row>

        {/* Información Principal del Producto */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <Card className="producto-detalle-image-card">
              <img 
                src={product.imagen} 
                alt={product.nombre}
                className="producto-detalle-imagen"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600/2E8B57/FFFFFF?text=Imagen+No+Disponible';
                }}
              />
            </Card>
          </Col>
          
          <Col lg={6}>
            <div className="producto-detalle-info">
              {/* Categoría */}
              <div className="mb-3">
                <Badge bg="success" className="categoria-badge-large">
                  {categoryIcons[product.categoria]} {product.categoria}
                </Badge>
                {product.stock < product.stock_critico && (
                  <Badge bg="danger" className="ms-2">
                    ⚠️ Stock Bajo
                  </Badge>
                )}
              </div>

              {/* Nombre del Producto */}
              <h1 className="producto-detalle-titulo">{product.nombre}</h1>
              
              {/* Precio */}
              <div className="producto-detalle-precio-section mb-3">
                <span className="producto-detalle-precio">{formatearPrecio(product.precio)}</span>
              </div>

              {/* Descripción */}
              <div className="producto-detalle-descripcion-section mb-4">
                <h5 className="seccion-titulo">Descripción</h5>
                <p className="producto-detalle-descripcion">{product.descripcion}</p>
              </div>

              {/* Información de Stock */}
              <div className="stock-info-section mb-4">
                <h5 className="seccion-titulo">Disponibilidad</h5>
                <div className="stock-status">
                  <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? '✅ En Stock' : '❌ Agotado'}
                  </span>
                  <span className="stock-quantity">({product.stock} unidades disponibles)</span>
                </div>
              </div>

              {/* Selector de Cantidad y Botón de Compra */}
              <div className="purchase-section">
                <Row className="align-items-center">
                  <Col md={4} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label className="quantity-label">Cantidad</Form.Label>
                      <Form.Select
                        value={cantidad}
                        onChange={(e) => setCantidad(parseInt(e.target.value))}
                        className="quantity-select"
                        disabled={product.stock === 0}
                      >
                        {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Button
                      variant="warning"
                      size="lg"
                      className="w-100 add-to-cart-btn-large"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? '❌ PRODUCTO AGOTADO' : '🛒 AGREGAR AL CARRITO'}
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Información Adicional */}
              <div className="additional-info mt-4">
                <div className="info-item">
                  <span className="info-icon">🚚</span>
                  <span className="info-text">Envío gratis en compras sobre $30.000</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">↩️</span>
                  <span className="info-text">Devolución fácil en 30 días</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🛡️</span>
                  <span className="info-text">Garantía de satisfacción</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <Row className="mt-5">
            <Col>
              <div className="related-products-section">
                <h3 className="seccion-titulo-large text-center mb-4">Productos Relacionados</h3>
                <Row>
                  {relatedProducts.map(relatedProduct => (
                    <Col key={relatedProduct.codigo} lg={3} md={6} className="mb-4">
                      <Card className="h-100 shadow-sm related-product-card">
                        <Card.Img 
                          variant="top" 
                          src={relatedProduct.imagen} 
                          className="related-product-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200/2E8B57/FFFFFF?text=Imagen+No+Disponible';
                          }}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Badge bg="success" className="mb-2">
                            {categoryIcons[relatedProduct.categoria]} {relatedProduct.categoria}
                          </Badge>
                          <Card.Title className="h6 related-product-title">
                            {relatedProduct.nombre}
                          </Card.Title>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-bold text-success">
                                {formatearPrecio(relatedProduct.precio)}
                              </span>
                            </div>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="w-100"
                              as={Link}
                              to={`/producto/${relatedProduct.codigo}`}
                            >
                              Ver Detalles
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ProductoDetalle;