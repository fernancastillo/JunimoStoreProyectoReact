import React from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';

const ContactForm = ({ 
  formData, 
  errors, 
  isSubmitting, 
  showAlert, 
  alertMessage, 
  alertVariant,
  onInputChange, 
  onSubmit,
  onClearForm 
}) => {
  return (
    <Card className="border-0 shadow-lg">
      <Card.Header className="bg-gradient text-white py-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-1">Formulario de Contacto</h3>
            <p className="mb-0 opacity-75">Completa el formulario y te contactaremos</p>
          </div>
          <Badge bg="light" text="dark" className="fs-6">
            <i className="bi bi-chat-dots me-2"></i>
            Respuesta en 24h
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4 p-md-5">
        {showAlert && (
          <Alert variant={alertVariant} dismissible>
            {alertMessage}
          </Alert>
        )}

        <Form onSubmit={onSubmit} noValidate>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Nombre completo <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={onInputChange}
                  isInvalid={!!errors.nombre}
                  className="py-2"
                  placeholder="Ingresa tu nombre completo"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  isInvalid={!!errors.email}
                  className="py-2"
                  placeholder="tu@email.com"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          {/* Resto del formulario... */}
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="py-3 fw-semibold"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="bi bi-send-check me-2"></i>
                  Enviar Mensaje
                </>
              )}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              type="button"
              onClick={onClearForm}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Limpiar Formulario
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ContactForm;