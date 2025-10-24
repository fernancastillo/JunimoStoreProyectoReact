import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import ProductGrid from '../../components/tienda/ProductGrid/ProductGrid';
import { dataService } from '../../utils/tienda/dataService';
import { cartService } from '../../utils/tienda/cartService';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);

  useEffect(() => {
    const loadProducts = () => {
      const productsData = dataService.getProducts();
      const categoriesData = dataService.getCategories();
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = dataService.getProductsByCategory(selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleAddToCart = (product) => {
    setAlertProduct(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container>
      {/* Alert de producto agregado */}
      {showAlert && alertProduct && (
        <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          ¡{alertProduct.nombre} agregado al carrito!
        </Alert>
      )}

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <h2>Nuestros Productos</h2>
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Grid de Productos */}
      <ProductGrid 
        products={filteredProducts} 
        onAddToCart={handleAddToCart}
      />
    </Container>
  );
};

export default Index;