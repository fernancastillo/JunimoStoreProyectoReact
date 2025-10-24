import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';

const ContactInfo = () => {
  const contactItems = [
    {
      icon: 'bi bi-geo-alt-fill',
      title: 'Dirección',
      content: 'Av. Stardew Valley 123\nSantiago Centro\nRegión Metropolitana, Chile',
      buttonText: 'Ver en Maps',
      variant: 'outline-primary',
      iconColor: 'text-primary',
      bgColor: 'bg-primary bg-opacity-10'
    },
    {
      icon: 'bi bi-telephone-fill',
      title: 'Teléfono',
      content: '+56 2 2345 6789\nLunes a Viernes: 9:00 - 18:00\nSábados: 10:00 - 14:00',
      buttonText: 'Llamar Ahora',
      variant: 'outline-success',
      iconColor: 'text-success',
      bgColor: 'bg-success bg-opacity-10'
    },
    {
      icon: 'bi bi-envelope-fill',
      title: 'Email',
      content: 'contacto@stardewstore.cl\nSoporte: soporte@stardewstore.cl\nVentas: ventas@stardewstore.cl',
      buttonText: 'Enviar Email',
      variant: 'outline-warning',
      iconColor: 'text-warning',
      bgColor: 'bg-warning bg-opacity-10'
    }
  ];

  return (
    <>
      <Row className="mt-5 pt-4">
        {contactItems.map((item, index) => (
          <Col lg={4} key={index} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className={`${item.bgColor} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                     style={{width: '80px', height: '80px'}}>
                  <i className={`${item.icon} fs-3 ${item.iconColor}`}></i>
                </div>
                <Card.Title className="h5">{item.title}</Card.Title>
                <Card.Text className="text-muted">
                  {item.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < item.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0">
                <Button variant={item.variant} size="sm" className="w-100">
                  <i className={`${item.icon.split(' ')[0]} me-2`}></i>
                  {item.buttonText}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Horario de atención */}
      <Row className="mt-3">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 bg-light">
            <Card.Body className="text-center py-3">
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock text-primary me-2"></i>
                  <span className="fw-semibold">Horario de Atención:</span>
                </div>
                <Badge bg="outline-primary" className="text-dark">
                  Lunes a Viernes: 9:00 - 18:00 hrs
                </Badge>
                <Badge bg="outline-primary" className="text-dark">
                  Sábados: 10:00 - 14:00 hrs
                </Badge>
                <Badge bg="outline-danger" className="text-dark">
                  Domingos: Cerrado
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ContactInfo;