import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productosData from '../../data/productos.json';
import './index.css';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const uniqueCategories = ['all', ...new Set(productosData.map(product => product.categoria))];
    setProducts(productosData);
    setFilteredProducts(productosData);
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const categoryIcons = {
    'all': '⭐',
    'Accesorios': '🔑',
    'Decoración': '🏠',
    'Peluches': '🧸',
    'Guías': '📚',
    'Mods Digitales': '💻',
    'Polera Personalizada': '👕',
    'Juego De Mesa': '🎲'
  };

  const handleAddToCart = (product) => {
    console.log('Agregar al carrito:', product);
    alert(`¡${product.nombre} agregado al carrito!`);
  };

  return (
    <div className="home-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      {/* HEADER CON CARTEL JUNIMOSHOP - SIN FONDOS EXTRA */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <img 
                src="src/assets/tienda/junimoshop.png"
                alt="Junimo Shop"
                className="main-shop-banner img-fluid"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x300/2E8B57/FFFFFF?text=Junimo+Shop';
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN "NUESTROS PRODUCTOS" - SIMPLE */}
      <section className="title-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="main-title">Nuestros Productos</h1>
              <p className="main-subtitle">
                Descubre la magia de Stardew Valley en nuestra colección exclusiva
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN DE PRODUCTOS - SIN FONDO BLANCO QUE TAPE EL FONDO PRINCIPAL */}
      <section className="products-section">
        <Container>
          {/* Filtros Responsivos */}
          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold filter-label">🔍 Buscar Productos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-bold filter-label">📂 Filtrar por Categoría</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryIcons[category]} {category === 'all' ? 'Todas las Categorías' : category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Botones de Categorías Rápidas */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="category-quick-btn"
                  >
                    <span className="me-1">{categoryIcons[category]}</span>
                    {category === 'all' ? 'Todos' : category}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>

          {/* Contador de Resultados */}
          <Row className="mb-4">
            <Col>
              <div className="text-center">
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 results-badge">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </Col>
          </Row>

          {/* Grid de Productos */}
          <Row>
            {filteredProducts.map(product => (
              <Col key={product.codigo} xl={3} lg={4} md={6} className="mb-4">
                <Card className="h-100 shadow-sm product-card">
                  <div className="product-image-container">
                    <Card.Img 
                      variant="top" 
                      src={product.imagen} 
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/2E8B57/FFFFFF?text=Imagen+No+Disponible';
                      }}
                    />
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Badge bg="success" className="mb-2 category-badge">
                        {categoryIcons[product.categoria]} {product.categoria}
                      </Badge>
                      {product.stock < product.stock_critico && (
                        <Badge bg="danger" className="ms-1 stock-badge">
                          ⚠️ Stock Bajo
                        </Badge>
                      )}
                    </div>
                    
                    <Card.Title className="h6 product-title">
                      {product.nombre}
                    </Card.Title>
                    
                    <Card.Text className="text-muted small product-description flex-grow-1">
                      {product.descripcion}
                    </Card.Text>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-success product-price">
                          {formatearPrecio(product.precio)}
                        </span>
                        <small className="text-muted stock-info">
                          📦 Stock: {product.stock}
                        </small>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="details-btn"
                          as={Link}
                          to={`/producto/${product.codigo}`}
                        >
                          👀 Ver Detalles
                        </Button>
                        <Button 
                          variant="warning" 
                          size="sm"
                          className="cart-btn"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? '❌ Sin Stock' : '🛒 Agregar al Carrito'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            
            {filteredProducts.length === 0 && (
              <Col>
                <div className="text-center py-5">
                  <div className="empty-state">
                    <span className="empty-icon display-1">🌾</span>
                    <h4 className="text-muted mt-3">No se encontraron productos</h4>
                    <Button 
                      variant="outline-warning" 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchTerm('');
                      }}
                      className="mt-2"
                    >
                      Ver Todos los Productos
                    </Button>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Index;