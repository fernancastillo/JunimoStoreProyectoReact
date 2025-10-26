import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Card, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productosData from '../../data/productos.json';
import categoriasImage from '../../assets/tienda/categorias.png';
import './Productos.css'; 

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);

  useEffect(() => {
    const loadProducts = () => {
      const categoriasUnicas = ['all', ...new Set(productosData.map(producto => producto.categoria))];
      setProducts(productosData);
      setFilteredProducts(productosData);
      setCategories(categoriasUnicas);
    };

    loadProducts();
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

  const handleAddToCart = (product) => {
    const savedCart = localStorage.getItem('junimoCart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cartItems.find(item => item.codigo === product.codigo);
    
    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.codigo === product.codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      newCartItems = [...cartItems, { ...product, cantidad: 1 }];
    }

    localStorage.setItem('junimoCart', JSON.stringify(newCartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setAlertProduct(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

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

  const categoryNames = {
    'all': 'Todos los Productos',
    'Accesorios': 'Accesorios',
    'Decoración': 'Decoración',
    'Peluches': 'Peluches',
    'Guías': 'Guías',
    'Mods Digitales': 'Mods Digitales',
    'Polera Personalizada': 'Poleras Personalizadas',
    'Juego De Mesa': 'Juegos de Mesa'
  };

  return (
    <div className="productos-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      {/* Alert de producto agregado */}
      {showAlert && alertProduct && (
        <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          ¡{alertProduct.nombre} agregado al carrito!
        </Alert>
      )}

      <Container fluid className="py-4">
        {/* IMAGEN DE CATEGORÍAS GRANDE - CON MARGIN TOP */}
        <Row className="mb-4 mt-3">
          <Col>
            <div className="text-center">
              <img 
                src={categoriasImage} 
                alt="Categorías" 
                className="categorias-img-main"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x200/2E8B57/FFFFFF?text=Categorías';
                }}
              />
            </div>
          </Col>
        </Row>

        {/* FILTRO DE BÚSQUEDA */}
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <Form.Group>
              <Form.Label className="filter-label">🔍 Buscar Productos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Botones de Categorías */}
        <Row className="mb-4">
          <Col>
            <div className="category-buttons">
              {categories.map(category => (
                <Button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="category-icon">{categoryIcons[category]}</span>
                  <span className="category-text">{categoryNames[category]}</span>
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Contador de Resultados */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <Badge bg="warning" text="dark" className="results-badge">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </Col>
        </Row>

        {/* Grid de Productos */}
        <Row>
          {filteredProducts.map(product => (
            <Col key={product.codigo} xl={3} lg={4} md={6} sm={6} className="mb-4">
              <Card className="h-100 shadow-sm product-card">
                <Card.Img 
                  variant="top" 
                  src={product.imagen} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/2E8B57/FFFFFF?text=Imagen+No+Disponible';
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge bg="success" className="mb-2">
                      {categoryIcons[product.categoria]} {product.categoria}
                    </Badge>
                    {product.stock < product.stock_critico && (
                      <Badge bg="danger" className="ms-1">⚠️ Stock Bajo</Badge>
                    )}
                  </div>
                  
                  <Card.Title className="product-title">
                    {product.nombre}
                  </Card.Title>
                  
                  <Card.Text className="text-muted small product-description">
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
                    
                    {/* BOTONES MEJORADOS - Agregar al Carrito y Ver Detalles */}
                    <div className="d-grid gap-2">
                      <Button 
                        variant="warning" 
                        size="sm"
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? '❌ Sin Stock' : '🛒 Agregar al Carrito'}
                      </Button>
                      
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="details-btn"
                        as={Link}
                        to={`/producto/${product.codigo}`}
                      >
                        👁️ Ver Detalles
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
                  <span className="empty-icon">🌾</span>
                  <h4 className="text-white mt-3">No se encontraron productos</h4>
                  <p className="text-white">Intenta con otros filtros de búsqueda</p>
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
    </div>
  );
};

export default Productos;