import { saveLocalstorage, loadFromLocalstorage, deleteFromLocalstorage } from '../localstorageHelper';
import usuariosData from '../../data/usuarios.json';

// Claves para localStorage
const AUTH_KEY = 'auth_user';
const USER_TYPE_KEY = 'user_type';

export const authService = {
  // Autenticar usuario desde el JSON
  login: async (email, password) => {
    try {
      // Buscar usuario en el JSON importado
      const user = usuariosData.usuarios.find(u => 
        u.correo === email && u.contrasena === password
      );
      
      if (user) {
        const userData = {
          id: user.id,
          nombre: user.nombre,
          email: user.correo,
          type: user.categoria,
          loginTime: new Date().toISOString()
        };
        
        saveLocalstorage(AUTH_KEY, userData);
        saveLocalstorage(USER_TYPE_KEY, user.categoria);
        
        return {
          success: true,
          user: userData,
          redirectTo: user.categoria === 'Admin' ? '/admin/dashboard' : '/index'
        };
      }
      
      return {
        success: false,
        error: 'Credenciales incorrectas'
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error del servidor'
      };
    }
  },

  // Cerrar sesión
  logout: () => {
    deleteFromLocalstorage(AUTH_KEY);
    deleteFromLocalstorage(USER_TYPE_KEY);
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return loadFromLocalstorage(AUTH_KEY) !== null;
  },

  // Obtener datos del usuario actual
  getCurrentUser: () => {
    return loadFromLocalstorage(AUTH_KEY);
  },

  // Obtener tipo de usuario
  getUserType: () => {
    return loadFromLocalstorage(USER_TYPE_KEY);
  },

  // Verificar si es admin
  isAdmin: () => {
    return loadFromLocalstorage(USER_TYPE_KEY) === 'Admin';
  },

  // Verificar si es cliente
  isClient: () => {
    return loadFromLocalstorage(USER_TYPE_KEY) === 'Cliente';
  }
};