import { jwtService } from '../jwtService';

/**
 * Verifica si el usuario puede acceder al admin
 * @returns {boolean} true si puede acceder, false si no
 */
export const canAccessAdmin = () => {
  // 1. Verificar si está autenticado usando JWT
  if (!jwtService.isAuthenticated()) {
    return false;
  }

  // 2. Verificar validez del token
  const tokenValid = jwtService.checkTokenValidity();
  if (!tokenValid) {
    return false;
  }

  // 3. Obtener usuario del token JWT
  const user = jwtService.getUserFromToken();
  if (!user) {
    return false;
  }

  // 4. Verificar múltiples tipos de admin
  const userType = user.tipo || user.type || '';
  const isAdmin = userType === 'Admin' ||
    userType === 'Administrador' ||
    userType === 'admin' ||
    userType === 'administrador';

  return isAdmin;
};

/**
 * Obtiene la ruta de redirección según el tipo de usuario y tiempo restante
 * @returns {string|null} ruta a la que debe redirigir, o null si puede acceder
 */
export const getRedirectRoute = () => {
  // 1. Verificar autenticación
  if (!jwtService.isAuthenticated()) {
    return '/login?redirect=' + encodeURIComponent(window.location.pathname);
  }

  // 2. Verificar validez del token
  const tokenValid = jwtService.checkTokenValidity();
  if (!tokenValid) {
    // Token expirado
    jwtService.clearToken();
    return '/login?session=expired';
  }

  // 3. Obtener usuario del token
  const user = jwtService.getUserFromToken();
  if (!user) {
    return '/login';
  }

  // 4. Verificar tiempo restante (si quedan menos de 2 minutos, advertir)
  const timeRemaining = jwtService.getTimeRemaining();
  if (timeRemaining > 0 && timeRemaining <= 2) {
    // Podríamos advertir pero aún permitir acceso
    console.warn(`Sesión por expirar en ${timeRemaining} minutos`);
  }

  // 5. Verificar tipo de usuario para redirección
  const userType = user.tipo || user.type || '';
  
  // Normalizar tipo
  const normalizedType = userType.toLowerCase();
  
  switch(normalizedType) {
    case 'admin':
    case 'administrador':
      return null; // Puede acceder al admin
      
    case 'vendedor':
      return '/vendedor';
      
    case 'cliente':
    case 'client':
      return '/index';
      
    default:
      // Tipo desconocido, redirigir a inicio
      return '/index';
  }
};

/**
 * Hook para protección de rutas (opcional - para usar en componentes)
 */
export const useAdminAccess = () => {
  const canAccess = canAccessAdmin();
  const redirectTo = getRedirectRoute();
  const timeRemaining = jwtService.getTimeRemaining();

  return {
    canAccess,
    redirectTo,
    isAuthenticated: jwtService.isAuthenticated(),
    isAdmin: canAccess,
    timeRemaining,
    user: jwtService.getUserFromToken(),
    logout: () => {
      jwtService.clearToken();
      window.location.href = '/login';
    }
  };
};

/**
 * Verifica si puede acceder como vendedor
 * @returns {boolean} true si puede acceder como vendedor
 */
export const canAccessVendedor = () => {
  if (!jwtService.isAuthenticated()) {
    return false;
  }

  const tokenValid = jwtService.checkTokenValidity();
  if (!tokenValid) {
    return false;
  }

  const user = jwtService.getUserFromToken();
  if (!user) {
    return false;
  }

  const userType = user.tipo || user.type || '';
  const normalizedType = userType.toLowerCase();
  
  return normalizedType === 'vendedor' || 
         normalizedType === 'admin' || 
         normalizedType === 'administrador';
};

/**
 * Verifica si puede acceder como cliente
 * @returns {boolean} true si puede acceder como cliente
 */
export const canAccessCliente = () => {
  if (!jwtService.isAuthenticated()) {
    return false;
  }

  const tokenValid = jwtService.checkTokenValidity();
  if (!tokenValid) {
    return false;
  }

  const user = jwtService.getUserFromToken();
  if (!user) {
    return false;
  }

  const userType = user.tipo || user.type || '';
  const normalizedType = userType.toLowerCase();
  
  // Cualquier usuario autenticado puede acceder como cliente
  return normalizedType === 'cliente' || 
         normalizedType === 'client' ||
         normalizedType === 'vendedor' || 
         normalizedType === 'admin' || 
         normalizedType === 'administrador';
};

/**
 * Obtiene el tipo de usuario normalizado
 * @returns {string} tipo de usuario normalizado
 */
export const getUserType = () => {
  if (!jwtService.isAuthenticated()) {
    return null;
  }

  const user = jwtService.getUserFromToken();
  if (!user) {
    return null;
  }

  const userType = user.tipo || user.type || '';
  
  // Normalizar tipos
  const normalizedType = userType.toLowerCase();
  
  if (normalizedType.includes('admin')) {
    return 'Administrador';
  } else if (normalizedType.includes('vendedor')) {
    return 'Vendedor';
  } else if (normalizedType.includes('cliente') || normalizedType.includes('client')) {
    return 'Cliente';
  }
  
  return 'Cliente'; // Por defecto
};