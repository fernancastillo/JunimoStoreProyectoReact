import { jwtDecode } from 'jwt-decode';

const JWT_KEY = 'jwt_token';
const USER_KEY = 'auth_user';

// Tiempos de expiración en milisegundos por rol
const EXPIRATION_TIMES = {
  'Cliente': 8 * 60 * 60 * 1000,      // 8 horas
  'Vendedor': 4 * 60 * 60 * 1000,     // 4 horas
  'Administrador': 30 * 60 * 1000,    // 30 minutos
};

export const jwtService = {
  // Generar un token JWT simulado 
  generateSimulatedToken: (userData, userType) => {
    const expirationTime = EXPIRATION_TIMES[userType] || EXPIRATION_TIMES['Cliente'];
    const expirationDate = new Date().getTime() + expirationTime;
    
    const tokenData = {
      user: {
        id: userData.id,
        email: userData.email,
        type: userType,
        nombre: userData.nombre,
        apellido: userData.apellido,
        run: userData.run,
      },
      exp: expirationDate,
      iat: new Date().getTime()
    };

    // Token simulado en base64 
    const token = btoa(JSON.stringify(tokenData));
    return token;
  },

  // Verificar token (tanto simulado como real)
  verifyToken: (token) => {
    if (!token) return { valid: false, reason: 'Token no proporcionado' };
    
    try {
      // Primero intentamos decodificar como JWT real
      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000); // Tiempo en segundos para JWT estándar
        
        if (decoded.exp && decoded.exp < now) {
          return { valid: false, reason: 'Token expirado' };
        }
        
        return { valid: true, decoded, isRealJWT: true };
      } catch (jwtError) {
        // Si falla, intentamos como token simulado
        return jwtService.verifySimulatedToken(token);
      }
    } catch (error) {
      return { valid: false, reason: 'Token inválido' };
    }
  },

  // Verificar token simulado (para desarrollo)
  verifySimulatedToken: (token) => {
    try {
      const decodedString = atob(token);
      const tokenData = JSON.parse(decodedString);
      const now = new Date().getTime();
      
      if (!tokenData || !tokenData.exp) {
        return { valid: false, reason: 'Token inválido' };
      }
      
      if (tokenData.exp < now) {
        return { valid: false, reason: 'Token expirado' };
      }
      
      return { valid: true, data: tokenData, isRealJWT: false };
    } catch (error) {
      return { valid: false, reason: 'Error al verificar token' };
    }
  },

  // Decodificar cualquier tipo de token
  decodeToken: (token) => {
    if (!token) return null;
    
    try {
      // Intentar como JWT real
      try {
        return jwtDecode(token);
      } catch (jwtError) {
        // Intentar como token simulado
        const decodedString = atob(token);
        const tokenData = JSON.parse(decodedString);
        return tokenData;
      }
    } catch (error) {
      return null;
    }
  },

  // Guardar token en localStorage y programar logout automático
  saveToken: (token, userData) => {
    localStorage.setItem(JWT_KEY, token);
    
    // Solo guardar datos esenciales del usuario
    const minimalUserData = {
      id: userData.id,
      email: userData.email,
      type: userData.type,
      nombre: userData.nombre,
      apellido: userData.apellido
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(minimalUserData));
    
    // Programar logout automático basado en expiración del token
    const verification = jwtService.verifyToken(token);
    
    if (verification.valid) {
      let expirationTime;
      
      if (verification.isRealJWT) {
        // JWT real: exp está en segundos
        expirationTime = verification.decoded.exp * 1000; // Convertir a milisegundos
      } else {
        // Token simulado: exp ya está en milisegundos
        expirationTime = verification.data.exp;
      }
      
      const now = new Date().getTime();
      const timeUntilExpiration = expirationTime - now;
      
      if (timeUntilExpiration > 0) {
        // Limpiar cualquier timer anterior
        if (window.logoutTimer) {
          clearTimeout(window.logoutTimer);
        }
        
        // Programar logout automático
        window.logoutTimer = setTimeout(() => {
          jwtService.clearToken();
          window.dispatchEvent(new Event('authStateChanged'));
          
          // Redirigir solo si estamos en una página protegida
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/index')) {
            window.location.href = '/login?session=expired';
          }
        }, timeUntilExpiration);
      }
    }
    
    window.dispatchEvent(new Event('authStateChanged'));
  },

  // Obtener token almacenado
  getToken: () => {
    return localStorage.getItem(JWT_KEY);
  },

  // Obtener usuario del token
  getUserFromToken: () => {
    const token = jwtService.getToken();
    if (!token) return null;
    
    const verification = jwtService.verifyToken(token);
    if (verification.valid) {
      if (verification.isRealJWT) {
        return verification.decoded;
      } else {
        return verification.data.user;
      }
    }
    
    // Si el token no es válido, intentar obtener del localStorage
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = jwtService.getToken();
    if (!token) return false;
    
    const verification = jwtService.verifyToken(token);
    return verification.valid;
  },

  // Obtener rol del usuario
  getUserRole: () => {
    const user = jwtService.getUserFromToken();
    return user ? (user.type || user.tipo) : null;
  },

  // Limpiar token y datos de usuario
  clearToken: () => {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Limpiar timer de logout
    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
    }
    
    window.dispatchEvent(new Event('authStateChanged'));
  },

  // Obtener tiempo restante en minutos
  getTimeRemaining: () => {
    const token = jwtService.getToken();
    if (!token) return 0;
    
    const verification = jwtService.verifyToken(token);
    if (!verification.valid) return 0;
    
    let expirationTime;
    
    if (verification.isRealJWT) {
      expirationTime = verification.decoded.exp * 1000; // Convertir a milisegundos
    } else {
      expirationTime = verification.data.exp;
    }
    
    const now = new Date().getTime();
    const remainingMs = expirationTime - now;
    return Math.max(0, Math.floor(remainingMs / 60000)); // Convertir a minutos
  },

  // Verificar validez del token (para uso en intervalos)
  checkTokenValidity: () => {
    const token = jwtService.getToken();
    if (!token) return false;
    
    const verification = jwtService.verifyToken(token);
    
    if (!verification.valid) {
      jwtService.clearToken();
      return false;
    }
    
    return true;
  },

  // Obtener tiempo de expiración configurado por rol
  getExpirationTimeForRole: (role) => {
    return EXPIRATION_TIMES[role] || EXPIRATION_TIMES['Cliente'];
  },

  // Preparar headers para peticiones API
  getAuthHeader: () => {
    const token = jwtService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};