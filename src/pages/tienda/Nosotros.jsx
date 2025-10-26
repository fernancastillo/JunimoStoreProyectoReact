import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import historiaImage from '../../assets/tienda/developed-stardew.png';        // Imagen para historia
import misionImage from '../../assets/tienda/junimo.png';           // Imagen para misión
import visionImage from '../../assets/tienda/gallina.png';           // Imagen para visión
import pasionImage from '../../assets/tienda/caffe.png';           // Imagen para pasión
import comunidadImage from '../../assets/tienda/comunidad.png';     // Imagen para comunidad - CORREGIDO: quitado el punto extra
import calidadImage from '../../assets/tienda/junimoss.png';         // Imagen para calidad
import uneteImage from '../../assets/tienda/comunidad.png';             // Imagen para únete

import './Nosotros.css';

const Nosotros = () => {
  return (
    <div className="nosotros-page">
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div className="navbar-spacer"></div>

      <Container className="py-5">
        {/* HEADER PRINCIPAL */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="nosotros-titulo-principal">Sobre Junimos Store</h1>
              <p className="nosotros-subtitulo">
                Tu tienda oficial de Stardew Valley en Chile
              </p>
            </div>
          </Col>
        </Row>

        {/* HISTORIA */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="nosotros-card">
              <Card.Body className="p-4">
                <h2 className="nosotros-titulo-seccion">Nuestra Historia</h2>
                
               
                <div className="text-center mb-4">
                  <img 
                    src={historiaImage} 
                    alt="Desarrollo de Stardew Valley" 
                    className="nosotros-imagen-seccion"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="nosotros-icono-alternativo" style={{display: 'none'}}></span>
                </div>
                
                <p className="nosotros-texto">
                  Junimos Store nació del amor compartido por Stardew Valley, ese mágico lugar 
                  donde podemos escapar de la rutina y construir nuestra granja soñada. Como 
                  verdaderos fans del juego, entendemos la magia que envuelve cada detalle del 
                  valle y queremos llevar esa experiencia a tu vida cotidiana.
                </p>
                <p className="nosotros-texto">
                  Somos una iniciativa de fanáticos para fanáticos, creada por jugadores 
                  apasionados que queremos compartir nuestro entusiasmo por este maravilloso 
                  mundo. Aunque no tenemos una ubicación física, nuestro corazón está en cada 
                  producto que enviamos a lo largo de todo Chile.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* MISIÓN Y VISIÓN */}
        <Row className="mb-5">
          <Col md={6} className="mb-4">
            <Card className="nosotros-card mision-card">
              <Card.Body className="p-4">
                
                <div className="text-center mb-3">
                  <img 
                    src={misionImage} 
                    alt="Junimo - Nuestra misión" 
                    className="nosotros-imagen-seccion"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="nosotros-icono-alternativo" style={{display: 'none'}}>🎯</span>
                </div>
                
                <h3 className="nosotros-titulo-seccion text-center">Misión</h3>
                <p className="nosotros-texto text-center">
                  Ofrecer productos y experiencias de alta calidad para los fans de Stardew Valley, 
                  con un enfoque en la autenticidad, la creatividad y la construcción de comunidad.
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-4">
            <Card className="nosotros-card vision-card">
              <Card.Body className="p-4">
               
                <div className="text-center mb-3">
                  <img 
                    src={visionImage} 
                    alt="Gallina de Stardew Valley - Nuestra visión" 
                    className="nosotros-imagen-seccion"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="nosotros-icono-alternativo" style={{display: 'none'}}>🔭</span>
                </div>
                
                <h3 className="nosotros-titulo-seccion text-center">Visión</h3>
                <p className="nosotros-texto text-center">
                  Ser la tienda online líder en Chile para la comunidad de Stardew Valley, 
                  reconocida por su cercanía, originalidad, y programas de fidelización que 
                  premien a los jugadores más comprometidos.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

     
        <Row className="mb-5">
          <Col>
            <Card className="nosotros-card valores-card">
              <Card.Body className="p-4">
                <h2 className="nosotros-titulo-seccion text-center mb-4">Nuestros Valores</h2>
                <Row>
                  <Col md={4} className="text-center mb-4">
                    <div className="valor-item">
                    
                      <img 
                        src={pasionImage} 
                        alt="Café de Stardew Valley - Pasión" 
                        className="valor-imagen"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className="valor-icono-alternativo" style={{display: 'none'}}>❤️</span>
                      
                      <h4 className="valor-titulo">Pasión</h4>
                      <p className="valor-texto">
                        Amamos Stardew Valley tanto como tú y eso se refleja en cada producto
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={4} className="text-center mb-4">
                    <div className="valor-item">
                      
                      <img 
                        src={comunidadImage} 
                        alt="Comunidad de Stardew Valley" 
                        className="valor-imagen"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className="valor-icono-alternativo" style={{display: 'none'}}>🤝</span>
                      
                      <h4 className="valor-titulo">Comunidad</h4>
                      <p className="valor-texto">
                        Creemos en el poder de unir a los jugadores chilenos del valle
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={4} className="text-center mb-4">
                    <div className="valor-item">

                      <img 
                        src={calidadImage} 
                        alt="Junimos - Calidad" 
                        className="valor-imagen"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className="valor-icono-alternativo" style={{display: 'none'}}>⭐</span>
                      
                      <h4 className="valor-titulo">Calidad</h4>
                      <p className="valor-texto">
                        Solo ofrecemos productos que cumplen con nuestros altos estándares
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* COMUNIDAD */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card className="nosotros-card comunidad-card">
              <Card.Body className="p-4">
                <h2 className="nosotros-titulo-seccion text-center">Únete a Nuestra Comunidad</h2>
                

                <div className="text-center mb-4">
                  <img 
                    src={uneteImage} 
                    alt="Únete a nuestra comunidad de Stardew Valley" 
                    className="nosotros-imagen-seccion"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="nosotros-icono-alternativo" style={{display: 'none'}}>👥</span>
                </div>
                
                <p className="nosotros-texto text-center">
                  En Junimos Store no solo vendemos productos, creamos experiencias. 
                  Formamos parte de una comunidad vibrante de jugadores que comparten 
                  consejos, historias y su amor por Stardew Valley.
                </p>
                
              </Card.Body>
            </Card>
          </Col>
        </Row>


        <Row>
          <Col>
            <Card className="nosotros-card cta-card">
              <Card.Body className="p-4 text-center">
                <h2 className="nosotros-titulo-seccion">¿Listo para Explorar el Valle?</h2>
                <p className="nosotros-texto mb-4">
                  Descubre nuestra colección de productos inspirados en Stardew Valley y 
                  lleva un pedacito del valle a tu hogar.
                </p>
                <Link to="/productos" className="btn btn-warning btn-lg cta-btn">
                  🛍️ Ver Productos
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Nosotros;