import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';
import './Cart.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // Cargar carrito desde localStorage
  const loadCart = () => {
    try {
      const cartJSON = localStorage.getItem('junimoCart');
      console.log('🔄 Cargando carrito desde localStorage');
      
      if (cartJSON) {
        const items = JSON.parse(cartJSON);
        console.log('📦 Productos en carrito:', items);
        setCartItems(items);
      } else {
        console.log('🛒 Carrito vacío');
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
    setUser(authService.getCurrentUser());
    
    // Escuchar eventos de actualización del carrito
    const handleCartUpdate = () => {
      console.log('📢 Carrito recibió evento de actualización');
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Actualizar cantidad
  const handleUpdateQuantity = (productCode, newQuantity) => {
    try {
      const updatedCart = cartItems.map(item =>
        item.codigo === productCode
          ? { ...item, cantidad: Math.max(0, newQuantity) }
          : item
      ).filter(item => item.cantidad > 0);

      localStorage.setItem('junimoCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  // Eliminar producto
  const handleRemoveItem = (productCode) => {
    try {
      const updatedCart = cartItems.filter(item => item.codigo !== productCode);
      localStorage.setItem('junimoCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Calcular total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Finalizar compra
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const total = calculateTotal();
    
    try {
      console.log('✅ Compra realizada. Total:', total);
      
      // Vaciar carrito
      localStorage.removeItem('junimoCart');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Mostrar alerta de éxito
      setShowAlert(true);
      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);
      
    } catch (error) {
      console.error('Error en checkout:', error);
    }
  };

  const total = calculateTotal();

  // Componente para carrito vacío
  const EmptyCart = () => (
    <Container className="text-center py-5">
      <Row>
        <Col>
          <div className="empty-cart-icon display-1 mb-4">🛒</div>
          <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            ¡Descubre nuestros productos exclusivos de Stardew Valley!
          </p>
          <Button as={Link} to="/productos" variant="warning" size="lg">
            🌾 Explorar Productos
          </Button>
        </Col>
      </Row>
    </Container>
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="navbar-spacer"></div>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="navbar-spacer"></div>
      
      <Container className="py-4">
        {showAlert && (
          <Alert variant="success" className="text-center">
            ✅ ¡Compra realizada con éxito! Redirigiendo a tus pedidos...
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <h1 className="page-title">🛒 Mi Carrito de Compras</h1>
            <p className="text-muted">
              Revisa y modifica los productos en tu carrito
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <div className="cart-items-section">
              {/* Items del carrito */}
              {cartItems.map(item => (
                <Row key={item.codigo} className="cart-item align-items-center py-3 border-bottom">
                  <Col md={2}>
                    <img 
                      src={item.imagen} 
                      alt={item.nombre}
                      className="img-fluid rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkU4QjU3Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2VuPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </Col>
                  
                  <Col md={4}>
                    <h6 className="mb-1">{item.nombre}</h6>
                    <span className="badge bg-success mb-1">{item.categoria}</span>
                  </Col>
                  
                  <Col md={2}>
                    <div className="text-center">
                      <span className="fw-bold text-success">
                        ${item.precio.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </Col>
                  
                  <Col md={2}>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.codigo, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </Button>
                      
                      <span className="mx-3 fw-bold">{item.cantidad}</span>
                      
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.codigo, item.cantidad + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                  
                  <Col md={1}>
                    <div className="text-center fw-bold">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </div>
                  </Col>
                  
                  <Col md={1}>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveItem(item.codigo)}
                      title="Eliminar producto"
                    >
                      🗑️
                    </Button>
                  </Col>
                </Row>
              ))}
              
              {/* Acciones del carrito */}
              <Row className="mt-4">
                <Col>
                  <div className="d-flex justify-content-between">
                    <Button as={Link} to="/productos" variant="outline-primary">
                      ← Seguir Comprando
                    </Button>
                    
                    <Button 
                      variant="outline-danger" 
                      onClick={() => {
                        localStorage.removeItem('junimoCart');
                        setCartItems([]);
                        window.dispatchEvent(new Event('cartUpdated'));
                      }}
                    >
                      🗑️ Vaciar Carrito
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Resumen del Pedido</h5>
              </Card.Header>
              
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Productos ({cartItems.reduce((sum, item) => sum + item.cantidad, 0)})</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-success h5">
                    ${total.toLocaleString('es-CL')}
                  </strong>
                </div>
                
                {!user && (
                  <Alert variant="info" className="small">
                    💡 Inicia sesión para proceder con la compra
                  </Alert>
                )}
                
                <div className="d-grid">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={!user}
                  >
                    {!user ? 'Inicia Sesión para Comprar' : `Finalizar Compra - $${total.toLocaleString('es-CL')}`}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Carrito;