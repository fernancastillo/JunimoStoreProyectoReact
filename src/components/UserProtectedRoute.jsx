import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtService } from '../utils/jwtService';

const UserProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAuth = () => {
      // Verificar validez del token JWT
      const tokenValid = jwtService.checkTokenValidity();
      
      if (!tokenValid) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }
      
      // Cualquier usuario autenticado puede acceder
      setIsAuthorized(true);
      setIsValidating(false);
    };

    validateAuth();

    // Verificar cada 30 segundos
    const intervalId = setInterval(validateAuth, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (isValidating) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return children;
};

export default UserProtectedRoute;