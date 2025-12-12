import { dataService } from '../dataService';
import { jwtService } from '../jwtService';

export const authService = {
  // Autenticar usuario
  login: async (email, password) => {
    try {
      // Buscar usuario en la base de datos
      let usuarioDesdeBD;
      try {
        usuarioDesdeBD = await dataService.getUsuarioByCorreo(email);
      } catch (endpointError) {
        // Fallback: obtener todos y filtrar
        const todosUsuarios = await dataService.getUsuarios();
        usuarioDesdeBD = todosUsuarios.find(user => {
          const emailMatch = user.correo && user.correo.toLowerCase() === email.toLowerCase();
          return emailMatch;
        });
      }

      if (usuarioDesdeBD) {
        // Verificar contraseña
        const passwordHash = await authService.hashPasswordSHA256(password);

        if (usuarioDesdeBD.contrasenha === passwordHash) {
          // Normalizar tipo de usuario
          const tipoUsuario = authService.normalizeUserType(usuarioDesdeBD.tipo);

          // Datos del usuario
          const userData = {
            id: usuarioDesdeBD.run || usuarioDesdeBD.id,
            nombre: usuarioDesdeBD.nombre || '',
            apellido: usuarioDesdeBD.apellidos || usuarioDesdeBD.apellido || '',
            email: usuarioDesdeBD.correo,
            type: tipoUsuario,
            loginTime: new Date().toISOString(),
            run: usuarioDesdeBD.run,
            direccion: usuarioDesdeBD.direccion,
            comuna: usuarioDesdeBD.comuna,
            region: usuarioDesdeBD.region,
            telefono: usuarioDesdeBD.telefono,
            fechaNac: usuarioDesdeBD.fechaNac,
            source: 'oracle_cloud'
          };
          
          const token = jwtService.generateSimulatedToken(userData, tipoUsuario);
          
          // Guardar token
          jwtService.saveToken(token, userData);

          // Determinar redirección
          let redirectTo = '/index';
          if (tipoUsuario === 'Administrador') {
            redirectTo = '/admin/dashboard';
          } else if (tipoUsuario === 'Vendedor') {
            redirectTo = '/vendedor';
          }

          return {
            success: true,
            user: userData,
            token: token,
            redirectTo: redirectTo
          };
        } else {
          return {
            success: false,
            error: 'Contraseña incorrecta'
          };
        }
      } else {
        return {
          success: false,
          error: 'Usuario no encontrado en el sistema'
        };
      }

    } catch (bdError) {
      console.error('Error de autenticación:', bdError);
      return {
        success: false,
        error: 'Error de conexión con la base de datos. Intente más tarde.'
      };
    }
  },

  // Hashear contraseña con SHA256
  hashPasswordSHA256: async (password) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.toUpperCase();
    } catch (error) {
      // Fallback simple
      return authService.simpleSHA256(password);
    }
  },

  // Fallback para navegadores antiguos
  simpleSHA256: (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase();
  },

  // Normalizar tipos de usuario
  normalizeUserType: (tipo) => {
    if (!tipo) return 'Cliente';

    const tipoLower = tipo.toLowerCase().trim();

    if (tipoLower.includes('admin')) return 'Administrador';
    if (tipoLower.includes('cliente') || tipoLower.includes('client')) return 'Cliente';
    if (tipoLower.includes('vendedor')) return 'Vendedor';

    return 'Cliente';
  },

  // Cerrar sesión
  logout: () => {
    jwtService.clearToken();
    window.location.href = '/login?logout=success';
  },

  // Verificar autenticación
  isAuthenticated: () => {
    return jwtService.isAuthenticated();
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return jwtService.getUserFromToken();
  },

  // Obtener tipo de usuario
  getUserType: () => {
    return jwtService.getUserRole();
  },

  // Verificar roles
  isAdmin: () => {
    return authService.getUserType() === 'Administrador';
  },

  isVendedor: () => {
    return authService.getUserType() === 'Vendedor';
  },

  isClient: () => {
    return authService.getUserType() === 'Cliente';
  },

  // Obtener ruta de redirección
  getRedirectPath: () => {
    const userType = authService.getUserType();
    switch (userType) {
      case 'Administrador':
        return '/admin/dashboard';
      case 'Vendedor':
        return '/vendedor';
      default:
        return '/index';
    }
  },

  // Verificar si email existe
  emailExiste: async (email) => {
    try {
      const usuarioBD = await dataService.getUsuarioByCorreo(email);
      return !!usuarioBD;
    } catch (error) {
      try {
        const todosUsuarios = await dataService.getUsuarios();
        const emailExiste = todosUsuarios.some(user => {
          const correoUsuario = user.correo ? user.correo.toLowerCase().trim() : '';
          const emailBuscado = email.toLowerCase().trim();
          return correoUsuario === emailBuscado;
        });
        return emailExiste;
      } catch (secondError) {
        return false;
      }
    }
  },

  // Verificar conexión con BD
  checkDatabaseConnection: async () => {
    try {
      const usuarios = await dataService.getUsuarios();
      return {
        connected: true,
        userCount: usuarios.length,
        message: `Conexión exitosa con ${usuarios.length} usuarios en BD`
      };
    } catch (error) {
      return {
        connected: false,
        userCount: 0,
        message: 'Error de conexión con la base de datos'
      };
    }
  },

  // Obtener tiempo restante de sesión
  getTimeRemaining: () => {
    return jwtService.getTimeRemaining();
  },

  // Verificar token periódicamente
  checkAuth: () => {
    return jwtService.checkTokenValidity();
  },

  // Notificar cambios de autenticación
  notifyAuthChange: () => {
    window.dispatchEvent(new Event('authStateChanged'));
  },
};