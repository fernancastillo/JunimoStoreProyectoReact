import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { authService } from '../../utils/tienda/authService'; // Añadir esta importación

const UnauthorizedState = ({ navigate }) => {
  // Opcional: Puedes añadir información de sesión si está por expirar
  const timeRemaining = authService.getTimeRemaining();
  
  return (
    <div
      className="min-vh-100 w-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '80px' }}></div>
      <Container className="text-center py-5">
        <div className="display-1 mb-3">🔒</div>
        <h4 className="text-white">No has iniciado sesión</h4>
        <p className="text-white">Por favor inicia sesión para acceder a tu perfil</p>
        
        {/* Opcional: Mostrar advertencia si la sesión está por expirar */}
        {timeRemaining > 0 && timeRemaining <= 5 && (
          <div className="alert alert-warning mx-auto" style={{ maxWidth: '500px' }}>
            <small>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Tu sesión expirará en {timeRemaining} minutos
            </small>
          </div>
        )}
        
        <Button
          variant="warning"
          onClick={() => navigate('/login')}
          className="mt-3 rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#dedd8ff5',
            color: '#000000',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(222, 221, 143, 0.6)';
            e.target.style.backgroundColor = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = '#dedd8ff5';
          }}
        >
          Iniciar Sesión
        </Button>
      </Container>
    </div>
  );
};

export default UnauthorizedState;