import { jwtService } from './jwtService';

const API_BASE_URL = 'http://localhost:8094/v1';

// API Keys para cada tipo de usuario (igual que en el backend)
const API_KEYS = {
  admin: 'admin',
  vendedor: 'vendedor',
  cliente: 'cliente'
};

// Interceptor para manejar tokens expirados
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Función principal para llamadas API
const apiCall = async (endpoint, options = {}, requireApiKey = false, apiKeyType = 'admin') => {
  try {
    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      ...jwtService.getAuthHeader(),
      ...options.headers,
    };

    // Si el endpoint requiere API Key, agregarla
    if (requireApiKey) {
      const apiKey = API_KEYS[apiKeyType] || API_KEYS.admin;
      headers['X-API-KEY'] = apiKey;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
      body: options.body ? JSON.stringify(options.body) : options.body,
    });

    // Si recibimos 401 (Unauthorized)
    if (response.status === 401) {
      // Para endpoints que requieren API Key, intentar con otra key si aplica
      if (requireApiKey && apiKeyType !== 'admin') {
        // Intentar con admin como fallback
        return await apiCall(endpoint, options, requireApiKey, 'admin');
      }
      
      // Si no es un endpoint con API Key, manejar como token expirado
      if (!isRefreshing) {
        isRefreshing = true;
        
        jwtService.clearToken();
        isRefreshing = false;
        processQueue(new Error('Sesión expirada'));
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired';
        }
        
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        return apiCall(endpoint, options, requireApiKey, apiKeyType);
      }).catch(err => {
        throw err;
      });
    }

    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}`;
      let errorDetails = '';

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData.error || JSON.stringify(errorData);

        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
        errorDetails = errorText;
      }

      throw new Error(`${errorMessage} ${errorDetails ? `- Detalles: ${errorDetails}` : ''}`);
    }

    try {
      const result = await response.json();
      return result;
    } catch (jsonError) {
      return { success: true };
    }

  } catch (error) {
    if (error.message.includes('Failed to fetch') && jwtService.getToken()) {
      const isValid = jwtService.checkTokenValidity();
      if (!isValid) {
        jwtService.clearToken();
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    
    throw new Error(`Error al llamar ${endpoint}: ${error.message}`);
  }
};

export const dataService = {
  // Método para inicializar datos
  initializeData: () => {
    return true;
  },

  // --- MÉTODO DE AUTENTICACIÓN CON JWT (PARA FUTURO) ---
  loginJWT: async (credentials) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  // --- MÉTODOS PRODUCTOS ---
  getProductos: async () => {
    return await apiCall('/productos', { method: 'GET' }); // PÚBLICO
  },

  getProductoById: async (codigo) => {
    return await apiCall(`/productoById/${codigo}`, { method: 'GET' }); // PÚBLICO
  },

  getProductoByName: async (nombre) => {
    return await apiCall(`/productoByName/${nombre}`, { method: 'GET' }); // PÚBLICO
  },

  getProductosByCategoria: async (categoriaId) => {
    return await apiCall(`/productosByCategoria/${categoriaId}`, { method: 'GET' }); // PÚBLICO
  },

  getProductosByNombre: async (nombre) => {
    return await apiCall(`/productosByNombre?nombre=${encodeURIComponent(nombre)}`, { method: 'GET' });
  },

  getProductosStockCritico: async () => {
    return await apiCall('/productosStockCritico', { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  getProductosByPrecio: async (precioMin, precioMax) => {
    return await apiCall(`/productosByPrecio?precioMin=${precioMin}&precioMax=${precioMax}`, 
      { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  addProducto: async (producto) => {
    return await apiCall('/addProducto', {
      method: 'POST',
      body: producto,
    }, true, 'admin'); // ADMIN
  },

  updateProducto: async (producto) => {
    return await apiCall('/updateProducto', {
      method: 'PUT',
      body: producto,
    }, true, 'admin'); // ADMIN
  },

  deleteProducto: async (codigo) => {
    return await apiCall(`/deleteProducto/${codigo}`, { method: 'DELETE' }, true, 'admin'); // ADMIN
  },

  // --- MÉTODOS USUARIOS ---
  getUsuarios: async () => {
    return await apiCall('/usuarios', { method: 'GET' }, true, 'admin'); // ADMIN
  },

  getUsuarioById: async (run) => {
    return await apiCall(`/usuariosById/${run}`, { method: 'GET' }, true, 'cliente'); // ADMIN/VENDEDOR/CLIENTE
  },

  getUsuarioByCorreo: async (correo) => {
    return await apiCall(`/usuariosByCorreo/${correo}`, { method: 'GET' }, true, 'admin'); // ADMIN
  },

  getUsuarioByTipo: async (tipo) => {
    return await apiCall(`/usuariosByTipo/${tipo}`, { method: 'GET' }, true, 'admin'); // ADMIN
  },

  addUsuario: async (usuario) => {
    return await apiCall('/addUsuario', { // PÚBLICO
      method: 'POST',
      body: usuario,
    });
  },

  updateUsuario: async (usuario) => {
    return await apiCall('/updateUsuario', { // ADMIN/CLIENTE
      method: 'PUT',
      body: usuario,
    }, true, 'admin');
  },

  deleteUsuario: async (run) => {
    return await apiCall(`/deleteUsuario/${run}`, { method: 'DELETE' }, true, 'admin'); // ADMIN
  },

  // --- MÉTODOS CATEGORÍAS ---
  getCategorias: async () => {
    return await apiCall('/categorias', { method: 'GET' }); // PÚBLICO
  },

  getCategoriaById: async (id) => {
    return await apiCall(`/categoriaById/${id}`, { method: 'GET' }, true, 'admin'); // ADMIN
  },

  getCategoriaByName: async (nombre) => {
    return await apiCall(`/categoriaByName/${nombre}`, { method: 'GET' }, true, 'admin'); // ADMIN
  },

  addCategoria: async (categoria) => {
    return await apiCall('/addCategoria', {
      method: 'POST',
      body: categoria,
    }, true, 'admin'); // ADMIN
  },

  updateCategoria: async (categoria) => {
    return await apiCall('/updateCategoria', {
      method: 'PUT',
      body: categoria,
    }, true, 'admin'); // ADMIN
  },

  deleteCategoria: async (id) => {
    return await apiCall(`/deleteCategoria/${id}`, { method: 'DELETE' }, true, 'admin'); // ADMIN
  },

  // --- MÉTODOS ÓRDENES ---
  getOrdenes: async () => {
    return await apiCall('/ordenes', { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  getOrdenByNumero: async (numero) => {
    return await apiCall(`/OrdenByNumero/${numero}`, { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  addOrden: async (orden) => {
    return await apiCall('/addOrden', { // CLIENTE
      method: 'POST',
      body: orden,
    }, true, 'cliente');
  },

  updateOrden: async (orden) => {
    const ordenParaEnviar = {
      numeroOrden: orden.numeroOrden,
      estadoEnvio: orden.estadoEnvio
    };

    return await apiCall('/updateOrden', { // ADMIN
      method: 'PUT',
      body: ordenParaEnviar,
    }, true, 'admin');
  },

  updateOrdenEstado: async (numeroOrden, nuevoEstado) => {
    const ordenParaEnviar = {
      numeroOrden: numeroOrden,
      estadoEnvio: nuevoEstado
    };

    return await apiCall('/updateOrdenEstado', { // ADMIN
      method: 'PUT',
      body: ordenParaEnviar,
    }, true, 'admin');
  },

  deleteOrden: async (numero) => {
    return await apiCall(`/deleteOrden/${numero}`, { method: 'DELETE' }, true, 'admin'); // ADMIN
  },

  getOrdenesByUsuario: async (run) => {
    return await apiCall(`/ordenesByUsuario/${run}`, { method: 'GET' }, true, 'cliente'); // ADMIN/VENDEDOR/CLIENTE
  },

  getOrdenesByEstado: async (estado) => {
    return await apiCall(`/ordenesByEstado/${estado}`, { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  // --- MÉTODOS DETALLE ORDEN ---
  getDetallesOrdenes: async () => {
    return await apiCall('/detallesOrdenes', { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  getDetalleOrdenById: async (id) => {
    return await apiCall(`/detallesOrdenesById/${id}`, { method: 'GET' }, true, 'admin'); // ADMIN/VENDEDOR
  },

  addDetalleOrden: async (detalle) => {
    return await apiCall('/addDetalleOrden', { // CLIENTE
      method: 'POST',
      body: detalle,
    }, true, 'cliente');
  },

  // --- MÉTODOS ESPECIALES ---
  getProductosPorCategoria: async (categoriaNombre) => {
    try {
      const categorias = await dataService.getCategorias();
      const categoria = categorias.find(cat => cat.nombre === categoriaNombre);

      if (categoria) {
        return await dataService.getProductosByCategoria(categoria.id);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  // --- VERIFICAR ESTADO DE DATOS ---
  checkDataStatus: async () => {
    try {
      const productos = await dataService.getProductos();
      let usuarios = [];
      let ordenes = [];

      // Solo intentar cargar usuarios si hay sesión activa
      if (jwtService.isAuthenticated()) {
        try {
          usuarios = await dataService.getUsuarios();
        } catch (error) {
          console.warn('No se pudieron cargar usuarios:', error.message);
        }
      }

      // Solo intentar cargar órdenes si hay sesión activa
      if (jwtService.isAuthenticated()) {
        try {
          ordenes = await dataService.getOrdenes();
        } catch (error) {
          console.warn('No se pudieron cargar órdenes:', error.message);
        }
      }

      return {
        productos: {
          count: productos.length,
          loaded: productos.length > 0
        },
        usuarios: {
          count: usuarios.length,
          loaded: usuarios.length > 0
        },
        ordenes: {
          count: ordenes.length,
          loaded: ordenes.length > 0
        }
      };
    } catch (error) {
      return {
        productos: { count: 0, loaded: false },
        usuarios: { count: 0, loaded: false },
        ordenes: { count: 0, loaded: false }
      };
    }
  },

  // --- FUNCIONES DE AUTENTICACIÓN ---
  isAuthenticated: () => {
    return jwtService.isAuthenticated();
  },

  getCurrentUser: () => {
    return jwtService.getUserFromToken();
  },

  // --- FUNCIÓN PARA OBTENER API KEY SEGÚN USUARIO ---
  getApiKeyForUser: (userType) => {
    switch(userType) {
      case 'Administrador':
        return 'admin';
      case 'Vendedor':
        return 'vendedor';
      case 'Cliente':
        return 'cliente';
      default:
        return 'cliente';
    }
  },

  // --- FUNCIÓN PARA ENVIAR API KEY MANUALMENTE ---
  setApiKeyHeader: (userType) => {
    const apiKey = dataService.getApiKeyForUser(userType);
    return { 'X-API-KEY': apiKey };
  }
};