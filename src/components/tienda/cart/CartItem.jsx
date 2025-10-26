import React from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= item.stock) {
      onUpdateQuantity(item.codigo, newQuantity);
    }
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <Row className="cart-item align-items-center py-3 border-bottom">
      <Col md={2}>
        <img 
          src={item.imagen} 
          alt={item.nombre}
          className="img-fluid rounded"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80/2E8B57/FFFFFF?text=Imagen';
          }}
        />
      </Col>
      
      <Col md={4}>
        <h6 className="mb-1">{item.nombre}</h6>
        <Badge bg="success" className="mb-1">{item.categoria}</Badge>
        {item.stock < item.stock_critico && (
          <Badge bg="warning" text="dark" className="ms-1">
            ⚠️ Stock Bajo
          </Badge>
        )}
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
            onClick={() => handleQuantityChange(item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            -
          </Button>
          
          <Form.Control
            type="number"
            value={item.cantidad}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
            min="1"
            max={item.stock}
            className="mx-2 text-center"
            style={{ width: '70px' }}
          />
          
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => handleQuantityChange(item.cantidad + 1)}
            disabled={item.cantidad >= item.stock}
          >
            +
          </Button>
        </div>
        <div className="text-center small text-muted mt-1">
          Stock: {item.stock}
        </div>
      </Col>
      
      <Col md={1}>
        <div className="text-center fw-bold">
          ${subtotal.toLocaleString('es-CL')}
        </div>
      </Col>
      
      <Col md={1}>
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={() => onRemove(item.codigo)}
          title="Eliminar producto"
        >
          🗑️
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;