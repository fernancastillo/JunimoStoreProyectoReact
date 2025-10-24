import React, { useState, useEffect } from 'react';
import './Index.css';
import junimoShopImage from '../../assets/tienda/junimoshop.png';
import fondoStardew from '../../assets/tienda/fondostardew.png';
// Importa tu JSON de productos
import productosData from '../../data/productos.json';

const Index = () => {
  const [slideActual, setSlideActual] = useState(0);
  const [productosCarrusel, setProductosCarrusel] = useState([]);

  // Función para obtener 3 productos aleatorios para el carrusel
  const obtenerProductosAleatorios = () => {
    if (productosData.length <= 3) {
      return productosData;
    }
    const mezclados = [...productosData].sort(() => Math.random() - 0.5);
    return mezclados.slice(0, 3);
  };

  // Inicializar carrusel con productos aleatorios al cargar la página
  useEffect(() => {
    setProductosCarrusel(obtenerProductosAleatorios());
  }, []);

  // Cambio automático cada 3 segundos entre slides
  useEffect(() => {
    if (productosCarrusel.length === 0) return;
    
    const intervaloSegundos = setInterval(() => {
      setSlideActual((prev) => (prev + 1) % productosCarrusel.length);
    }, 3000);

    return () => clearInterval(intervaloSegundos);
  }, [productosCarrusel.length]);

  const siguienteSlide = () => {
    setSlideActual((prev) => (prev + 1) % productosCarrusel.length);
  };

  const anteriorSlide = () => {
    setSlideActual((prev) => (prev - 1 + productosCarrusel.length) % productosCarrusel.length);
  };

  const irASlide = (index) => {
    setSlideActual(index);
  };

  // Agrupar categorías en filas de 3
  const agruparEnFilas = (array, elementosPorFila) => {
    const filas = [];
    for (let i = 0; i < array.length; i += elementosPorFila) {
      filas.push(array.slice(i, i + elementosPorFila));
    }
    return filas;
  };

  const categoriasEnFilas = agruparEnFilas(productosData, 3);

  return (
    <div className="home-container">
      {/* HEADER CON FONDO */}
      <header className="home-header" style={{
        background: `linear-gradient(135deg, rgba(46, 139, 87, 0.85) 0%, rgba(67, 160, 71, 0.85) 100%), url(${fondoStardew}) center/cover no-repeat`,
        backgroundBlendMode: 'overlay'
      }}>
        <div className="header-content">
          <img 
            src={junimoShopImage} 
            alt="Junimo Shop" 
            className="main-junimo-image"
          />
          <div className="welcome-text">
            <h1 className="welcome-title">Bienvenido a Junimo Store</h1>
            <p className="welcome-subtitle">Tu tienda de confianza del Valle</p>
          </div>
        </div>
      </header>

      {/* CARRUSEL AUTOMÁTICO - MOSTRAR LOS 3 PRODUCTOS VISIBLES */}
      <section className="carrusel-section">
        <div className="container">
          <h2 className="carrusel-titulo">Nuevos Lanzamientos</h2>
          <p className="carrusel-subtitulo">Descubre las últimas ofertas disponibles</p>
          
          {productosCarrusel.length > 0 && (
            <div className="carrusel-wrapper">
              <button className="carrusel-btn carrusel-btn-prev" onClick={anteriorSlide}>
                ‹
              </button>

              <div className="carrusel-container">
                {productosCarrusel.map((producto, index) => (
                  <div 
                    key={`${producto.id}-${index}`}
                    className={`carrusel-slide ${index === slideActual ? 'active' : ''}`}
                    style={{ transform: `translateX(-${slideActual * 100}%)` }}
                  >
                    <div className="producto-card">
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        className="producto-imagen"
                      />
                      <div className="producto-info">
                        <h3 className="producto-titulo">{producto.nombre}</h3>
                        <p className="producto-descripcion">{producto.descripcion}</p>
                        <button className="producto-boton">Ver Más</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="carrusel-btn carrusel-btn-next" onClick={siguienteSlide}>
                ›
              </button>
            </div>
          )}

          {productosCarrusel.length > 0 && (
            <div className="carrusel-indicadores">
              {productosCarrusel.map((_, index) => (
                <button
                  key={index}
                  className={`indicador ${index === slideActual ? 'active' : ''}`}
                  onClick={() => irASlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS - FILAS DE 3 */}
      <section className="categorias-section">
        <div className="container">
          <h2 className="categorias-titulo">Categorías</h2>
          
          {categoriasEnFilas.map((fila, indexFila) => (
            <div key={indexFila} className="categorias-fila">
              {fila.map((categoria) => (
                <div key={categoria.id} className="categoria-card">
                  <img 
                    src={categoria.imagen} 
                    alt={categoria.nombre}
                    className="categoria-imagen"
                  />
                  <div className="categoria-info">
                    <h3 className="categoria-nombre">{categoria.nombre}</h3>
                    <p className="categoria-descripcion">{categoria.descripcion}</p>
                    <button className="categoria-boton">Explorar</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;