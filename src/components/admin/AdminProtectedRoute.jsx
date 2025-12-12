import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getRedirectRoute } from '../../utils/admin/routeProtection';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const validateAccess = () => {
      // Obtener ruta de redirección desde routeProtection
      const redirectTo = getRedirectRoute();
      
      if (redirectTo) {
        setRedirectPath(redirectTo);
      } else {
        // Puede acceder
        setRedirectPath(null);
      }
      
      setIsValidating(false);
    };

    // Validar inmediatamente
    validateAccess();

    // Configurar intervalo para verificar cada 30 segundos
    const intervalId = setInterval(validateAccess, 30000);

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

  if (redirectPath) {
    // Redirigir guardando la ubicación intentada
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Si puede acceder, mostrar el contenido
  return children;
};

export default AdminProtectedRoute;