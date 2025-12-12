import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtService } from '../../utils/jwtService';

const VendedorProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAuth = () => {
      const tokenValid = jwtService.checkTokenValidity();
      
      if (!tokenValid) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }
      
      const user = jwtService.getUserFromToken();
      const isVendedor = user && (user.type === 'Vendedor' || user.tipo === 'Vendedor');
      const isAdmin = user && (user.type === 'Administrador' || user.tipo === 'Administrador');
      
      // Los administradores también pueden acceder al área de vendedor
      setIsAuthorized(isVendedor || isAdmin);
      setIsValidating(false);
    };

    validateAuth();

    const intervalId = setInterval(validateAuth, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (isValidating) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autorización...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    const isAuthenticated = jwtService.isAuthenticated();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    } else {
      return <Navigate to="/index" replace />;
    }
  }

  return children;
};

export default VendedorProtectedRoute;