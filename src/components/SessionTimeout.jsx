import React, { useState, useEffect } from 'react';
import { Modal, Button, ProgressBar, Alert } from 'react-bootstrap';
import { authService } from '../../utils/authService';

const SessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Verificar autenticación cada 30 segundos
    const checkAuthInterval = setInterval(() => {
      const isValid = authService.checkAuth();
      
      if (!isValid && authService.isAuthenticated()) {
        // Token expirado
        setSessionExpired(true);
        setTimeout(() => {
          authService.logout();
        }, 3000);
      }
    }, 30000);

    // Actualizar tiempo restante
    const updateTimeLeft = () => {
      if (authService.isAuthenticated()) {
        const minutesLeft = authService.getTimeRemaining();
        const userType = authService.getUserType();
        
        // Establecer tiempo total según rol
        let totalMinutes = 480; // Default Cliente
        
        if (userType === 'Administrador') totalMinutes = 30;
        else if (userType === 'Vendedor') totalMinutes = 240;
        
        setTotalTime(totalMinutes);
        setTimeLeft(minutesLeft);
        
        // Mostrar advertencia cuando queden 5 minutos o menos
        if (minutesLeft > 0 && minutesLeft <= 5) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      } else {
        setShowWarning(false);
      }
    };

    // Actualizar cada 10 segundos
    const timeUpdateInterval = setInterval(updateTimeLeft, 10000);
    
    // Ejecutar inmediatamente
    updateTimeLeft();

    return () => {
      clearInterval(checkAuthInterval);
      clearInterval(timeUpdateInterval);
    };
  }, []);

  const handleExtendSession = async () => {
    setShowWarning(false);
    
    // En un entorno real, aquí se renovaría el token
    // Por ahora, solo cerramos el modal
    // Para implementar refresh tokens más adelante:
    // try {
    //   const refreshed = await authService.refreshToken();
    //   if (refreshed) {
    //     setShowWarning(false);
    //   }
    // } catch (error) {
    //   console.error('Error al renovar sesión:', error);
    // }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const progressPercentage = totalTime > 0 ? 
    Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100)) : 0;

  // Determinar color de la barra de progreso
  const getProgressVariant = () => {
    if (timeLeft <= 1) return 'danger';
    if (timeLeft <= 3) return 'warning';
    return 'info';
  };

  return (
    <>
      {/* Modal de advertencia de expiración */}
      <Modal
        show={showWarning}
        onHide={() => setShowWarning(false)}
        backdrop="static"
        keyboard={false}
        centered
        className="session-timeout-modal"
      >
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Sesión por expirar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning" className="mb-3">
            <Alert.Heading>¡Atención!</Alert.Heading>
            <p>
              Tu sesión expirará en <strong>{timeLeft} {timeLeft === 1 ? 'minuto' : 'minutos'}</strong>.
            </p>
            <p className="mb-0">
              Para continuar trabajando, extiende tu sesión o guarda tu trabajo antes de que se cierre.
            </p>
          </Alert>
          
          <div className="mt-4">
            <div className="d-flex justify-content-between mb-1">
              <small>Tiempo restante:</small>
              <small>
                <strong>{timeLeft} min</strong> / {totalTime} min
              </small>
            </div>
            <ProgressBar 
              now={timeLeft} 
              max={totalTime}
              variant={getProgressVariant()}
              animated={timeLeft <= 2}
              style={{ height: '10px' }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar sesión ahora
          </Button>
          <Button variant="primary" onClick={handleExtendSession}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Extender sesión
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alerta de sesión expirada */}
      {sessionExpired && (
        <div className="position-fixed top-0 start-0 w-100 z-1050">
          <Alert 
            variant="danger" 
            className="m-0 rounded-0 text-center"
            dismissible
            onClose={() => setSessionExpired(false)}
          >
            <i className="bi bi-exclamation-octagon-fill me-2"></i>
            Tu sesión ha expirado. Serás redirigido a la página de login...
          </Alert>
        </div>
      )}
    </>
  );
};

export default SessionTimeout;