import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '../../components/tienda/PageHeader/PageHeader';
import ContactForm from '../../components/tienda/ContactForm/ContactForm';
import ContactInfo from '../../components/tienda/ContactInfo/ContactInfo';
import { useContactForm } from '../../utils/tienda/useContactForm';

const Contacto = () => {
  const {
    formData,
    errors,
    isSubmitting,
    showAlert,
    alertMessage,
    alertVariant,
    handleInputChange,
    handleSubmit,
    clearForm
  } = useContactForm();

  return (
    <Container className="py-5 mt-4">
      <PageHeader 
        title="Contáctanos"
        subtitle="¿Tienes preguntas sobre nuestros productos? Estamos aquí para ayudarte."
      />

      <Row className="justify-content-center">
        <Col lg={8}>
          <ContactForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            showAlert={showAlert}
            alertMessage={alertMessage}
            alertVariant={alertVariant}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onClearForm={clearForm}
          />
        </Col>
      </Row>

      <ContactInfo />
    </Container>
  );
};

export default Contacto;