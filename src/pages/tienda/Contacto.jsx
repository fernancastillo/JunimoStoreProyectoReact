import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Importar utilidades de contacto
import { 
  validarFormularioContacto, 
  sanitizarDatosContacto,
  formatearTelefonoChileno,
  enviarFormularioContacto,
  guardarContactoLocal,
  validarContenidoMensaje
} from '../../utils/tienda/contacto';

import './Contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMensaje, setAlertMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real al salir del campo
    if (value.trim()) {
      const erroresCampo = validarFormularioContacto({ [name]: value });
      if (erroresCampo[name]) {
        setErrores(prev => ({
          ...prev,
          [name]: erroresCampo[name]
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario completo
    const nuevosErrores = validarFormularioContacto(formData);
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setAlertMensaje('Por favor corrige los errores en el formulario');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    // Validar contenido del mensaje
    const validacionContenido = validarContenidoMensaje(formData.mensaje);
    if (!validacionContenido.valido) {
      setAlertMensaje('El mensaje contiene contenido no permitido');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    setEnviando(true);

    try {
      // Sanitizar datos
      const datosSanitizados = sanitizarDatosContacto(formData);
      
      // Formatear teléfono si existe
      if (datosSanitizados.telefono) {
        datosSanitizados.telefono = formatearTelefonoChileno(datosSanitizados.telefono);
      }

      // Enviar formulario (simulación)
      const resultado = await enviarFormularioContacto(datosSanitizados);
      
      // Guardar localmente para demo
      guardarContactoLocal(datosSanitizados);

      // Mostrar éxito
      setAlertMensaje('✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.');
      setShowAlert(true);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
      setErrores({});

    } catch (error) {
      setAlertMensaje(' Error al enviar el mensaje. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setEnviando(false);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  return (
    <div className="contacto-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      <Container className="py-5">
        {/* HEADER PRINCIPAL */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="contacto-titulo-principal">Contáctanos</h1>
              <p className="contacto-subtitulo">
                ¿Tienes preguntas? Estamos aquí para ayudarte
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* FORMULARIO DE CONTACTO */}
          <Col lg={8} className="mb-4">
            <Card className="contacto-card">
              <Card.Body className="p-4">
                <h2 className="contacto-titulo-seccion">Envíanos un Mensaje</h2>
                
                {showAlert && (
                  <Alert variant={alertMensaje.includes('✅') ? 'success' : 'danger'} className="mb-4">
                    {alertMensaje}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="contacto-label"> Nombre Completo</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`contacto-input ${errores.nombre ? 'is-invalid' : ''}`}
                          placeholder="Tu nombre"
                          required
                          disabled={enviando}
                        />
                        {errores.nombre && (
                          <div className="invalid-feedback d-block">
                            {errores.nombre}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="contacto-label">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`contacto-input ${errores.email ? 'is-invalid' : ''}`}
                          placeholder="tu@email.com"
                          required
                          disabled={enviando}
                        />
                        {errores.email && (
                          <div className="invalid-feedback d-block">
                            {errores.email}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="contacto-label">Teléfono (Opcional)</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`contacto-input ${errores.telefono ? 'is-invalid' : ''}`}
                          placeholder="+56 9 1234 5678"
                          disabled={enviando}
                        />
                        {errores.telefono && (
                          <div className="invalid-feedback d-block">
                            {errores.telefono}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="contacto-label">Asunto</Form.Label>
                        <Form.Select
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`contacto-input ${errores.asunto ? 'is-invalid' : ''}`}
                          required
                          disabled={enviando}
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="consulta">Consulta General</option>
                          <option value="pedido">Estado de Pedido</option>
                          <option value="devolucion">Devolución</option>
                          <option value="sugerencia">Sugerencia</option>
                          <option value="problema">Problema Técnico</option>
                          <option value="otro">Otro</option>
                        </Form.Select>
                        {errores.asunto && (
                          <div className="invalid-feedback d-block">
                            {errores.asunto}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="contacto-label">Mensaje</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`contacto-input contacto-textarea ${errores.mensaje ? 'is-invalid' : ''}`}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      required
                      disabled={enviando}
                    />
                    {errores.mensaje && (
                      <div className="invalid-feedback d-block">
                        {errores.mensaje}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      {formData.mensaje.length}/1000 caracteres
                    </Form.Text>
                  </Form.Group>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      className="contacto-btn-enviar"
                      disabled={enviando}
                    >
                      {enviando ? '⏳ Enviando...' : ' Enviar Mensaje'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* INFORMACIÓN DE CONTACTO */}
          <Col lg={4}>
            <Card className="contacto-info-card">
              <Card.Body className="p-4">
                <h3 className="contacto-titulo-seccion text-center">Información de Contacto</h3>
                
                <div className="contacto-info-item">
                  <div className="contacto-info-icon">📧</div>
                  <div className="contacto-info-content">
                    <h5>Email</h5>
                    <p>wenospalstardewvalley@junimostore.cl</p>
                  </div>
                </div>

                <div className="contacto-info-item">
                  <div className="contacto-info-icon">📱</div>
                  <div className="contacto-info-content">
                    <h5>WhatsApp</h5>
                    <p>+56 9 1234 5678</p>
                  </div>
                </div>

                <div className="contacto-info-item">
                  <div className="contacto-info-icon">🕒</div>
                  <div className="contacto-info-content">
                    <h5>Horario de Atención</h5>
                    <p>Lunes a Viernes: 9:00 - 18:00 hrs</p>
                    <p>Sábados: 10:00 - 14:00 hrs</p>
                  </div>
                </div>

                <div className="contacto-info-item">
                  <div className="contacto-info-icon">🌎</div>
                  <div className="contacto-info-content">
                    <h5>Envíos a Todo Chile</h5>
                    <p>Despachamos a todas las regiones</p>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <div className="contacto-redes-sociales">
                    <span className="contacto-red-social">📘</span>
                    <span className="contacto-red-social">📷</span>
                    <span className="contacto-red-social">🐦</span>
                    <span className="contacto-red-social">🎮</span>
                  </div>
                  <p className="contacto-texto-pequeno">Síguenos en redes sociales</p>
                </div>
              </Card.Body>
            </Card>

            {/* TARJETA DE AYUDA RÁPIDA */}
            <Card className="contacto-ayuda-card mt-4">
              <Card.Body className="p-4">
                <h4 className="contacto-titulo-seccion text-center">¿Necesitas Ayuda Rápida?</h4>
                <p className="contacto-texto text-center">
                  Revisa nuestras <Link to="/preguntas-frecuentes" className="contacto-link">preguntas frecuentes</Link> o escríbenos por WhatsApp para una respuesta inmediata.
                </p>
                <div className="text-center">
                  <Button className="contacto-btn-whatsapp">
                    💬 Chatear por WhatsApp
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* SECCIÓN DE MAPA */}
        <Row className="mt-5">
          <Col>
            <Card className="contacto-card">
              <Card.Body className="p-4">
                <h3 className="contacto-titulo-seccion text-center">📍 Donde Encontrarnos</h3>
                <p className="contacto-texto text-center mb-4">
                  Somos una tienda online, pero nuestro equipo está distribuido por todo Chile para brindarte el mejor servicio.
                </p>
                <div className="contacto-mapa-placeholder text-center">
                  <div className="contacto-mapa-icon">🗺️</div>
                  <p className="contacto-texto">🌎 Envíos a todo Chile</p>
                  <p className="contacto-texto-pequeno">Desde Arica hasta Punta Arenas</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contacto;