// src/utils/admin/reportUtils.js
import { formatCurrency } from './dashboardUtils';

/**
 * Formatea la fecha en formato DD-MM-YYYY
 */
export const formatearFecha = () => {
  const ahora = new Date();
  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
  const año = ahora.getFullYear();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  return `${dia}-${mes}-${año}_${horas}${minutos}`;
};

/**
 * Obtiene las órdenes desde app_ordenes en localStorage
 */
export const obtenerOrdenesDesdeAppOrdenes = async () => {
  try {
    const storedOrdenes = localStorage.getItem('app_ordenes');
    if (storedOrdenes) {
      const ordenes = JSON.parse(storedOrdenes);
      // Asegurar que siempre retorne un array
      return Array.isArray(ordenes) ? ordenes : [];
    }

    // Si no existe app_ordenes, intentar cargar desde el servicio
    const ordenService = await import('./ordenService');
    const ordenes = await ordenService.ordenService.getOrdenes();
    // Asegurar que siempre retorne un array
    return Array.isArray(ordenes) ? ordenes : [];
  } catch (error) {
    console.error('Error obteniendo órdenes para reporte:', error);
    return []; // Siempre retornar array vacío en caso de error
  }
};

/**
 * Verifica y migra datos de admin_ordenes a app_ordenes si es necesario
 */
export const verificarYMigrarDatosOrdenes = async () => {
  try {
    const adminOrdenes = localStorage.getItem('admin_ordenes');
    const appOrdenes = localStorage.getItem('app_ordenes');

    if (adminOrdenes && !appOrdenes) {
      // Migrar datos
      const ordenes = JSON.parse(adminOrdenes);
      localStorage.setItem('app_ordenes', JSON.stringify(ordenes));
      localStorage.removeItem('admin_ordenes');
      console.log('Datos de órdenes migrados de admin_ordenes a app_ordenes');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error en migración de órdenes:', error);
    return false;
  }
};

// Ejecutar verificación al cargar el módulo
verificarYMigrarDatosOrdenes();

/**
 * Genera un reporte de productos en formato CSV compatible con Excel
 */
export const generarReporteCSV = (data, tipo = 'productos') => {
  // Agregar BOM para UTF-8 (importante para Excel)
  const BOM = '\uFEFF';

  if (tipo === 'categorias') {
    // Headers para categorías
    const headers = ['ID', 'Nombre'];
    
    const rows = data.map(categoria => [
      categoria.id || '',
      `"${(categoria.nombre || '').replace(/"/g, '""')}"`
    ]);
    
    return BOM + [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Código original para productos
  const headers = [
    'Código',
    'Nombre',
    'Categoría',
    'Descripción',
    'Precio (CLP)',
    'Stock',
    'Stock Crítico',
    'Estado Stock'
  ].join(',');

  const rows = data.map(producto => {
    const estadoStock = producto.stock === 0
      ? 'SIN STOCK'
      : producto.stock <= producto.stock_critico
        ? 'STOCK CRÍTICO'
        : 'NORMAL';

    // Limpiar y formatear campos para CSV
    const nombreLimpio = producto.nombre.replace(/"/g, '""').replace(/,/g, ';');
    const descripcionLimpia = producto.descripcion.replace(/"/g, '""').replace(/,/g, ';');
    const categoriaLimpia = producto.categoria.replace(/"/g, '""');

    return [
      `"${producto.codigo}"`,
      `"${nombreLimpio}"`,
      `"${categoriaLimpia}"`,
      `"${descripcionLimpia}"`,
      producto.precio, // Sin comillas para que Excel lo detecte como número
      producto.stock,
      producto.stock_critico,
      `"${estadoStock}"`
    ].join(',');
  });

  return BOM + [headers, ...rows].join('\n');
};

/**
 * Genera un reporte de productos en formato CSV alternativo (separado por punto y coma)
 * Esto funciona mejor en algunas versiones de Excel
 */
export const generarReporteCSVExcel = (data, tipo = 'productos') => {
  const BOM = '\uFEFF';

  if (tipo === 'categorias') {
    const headers = ['ID', 'Nombre'];
    
    const rows = data.map(categoria => [
      categoria.id || '',
      categoria.nombre || ''
    ]);
    
    const csvContent = BOM + [headers, ...rows]
      .map(row => row.join(';'))
      .join('\n');
    
    return csvContent;
  }

  // Código original para productos
  const headers = [
    'Código',
    'Nombre',
    'Categoría',
    'Descripción',
    'Precio (CLP)',
    'Stock',
    'Stock Crítico',
    'Estado Stock'
  ].join(';'); // Usar punto y coma como separador

  const rows = data.map(producto => {
    const estadoStock = producto.stock === 0
      ? 'SIN STOCK'
      : producto.stock <= producto.stock_critico
        ? 'STOCK CRÍTICO'
        : 'NORMAL';

    return [
      producto.codigo,
      producto.nombre,
      producto.categoria,
      producto.descripcion,
      producto.precio,
      producto.stock,
      producto.stock_critico,
      estadoStock
    ].join(';');
  });

  return BOM + [headers, ...rows].join('\n');
};

/**
 * Genera un reporte de productos en formato JSON
 */
export const generarReporteJSON = (data, tipo = 'productos') => {
  if (tipo === 'categorias') {
    const reporte = {
      tipo: 'categorias',
      fechaGeneracion: new Date().toISOString(),
      totalCategorias: data.length,
      categorias: data
    };

    return JSON.stringify(reporte, null, 2);
  }

  // Código original para productos
  const reporte = {
    fechaGeneracion: new Date().toISOString(),
    totalProductos: data.length,
    productos: data.map(producto => ({
      ...producto,
      estadoStock: producto.stock === 0
        ? 'SIN STOCK'
        : producto.stock <= producto.stock_critico
          ? 'STOCK CRÍTICO'
          : 'NORMAL'
    }))
  };

  return JSON.stringify(reporte, null, 2);
};

/**
 * Descarga un archivo con el contenido proporcionado
 */
export const descargarArchivo = (contenido, nombreArchivo, tipoMIME) => {
  // Especificar UTF-8 explícitamente para CSV
  const mimeType = tipoMIME.includes('csv')
    ? 'text/csv;charset=utf-8;'
    : tipoMIME;

  const blob = new Blob([contenido], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = nombreArchivo;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Genera estadísticas para el reporte de productos
 */
export const generarEstadisticas = (data, tipo = 'productos') => {
  if (!Array.isArray(data)) {
    if (tipo === 'categorias') {
      return {
        total: 0,
        categoriaMasAntigua: null,
        categoriaMasReciente: null
      };
    }
    
    return {
      totalProductos: 0,
      sinStock: 0,
      stockCritico: 0,
      stockNormal: 0,
      categorias: 0
    };
  }

  if (tipo === 'categorias') {
    const total = data.length;
    
    // Encontrar categoría más antigua (menor ID)
    const categoriaMasAntigua = data.length > 0 
      ? data.reduce((min, cat) => cat.id < min.id ? cat : min, data[0]).nombre 
      : null;
    
    // Encontrar categoría más reciente (mayor ID)
    const categoriaMasReciente = data.length > 0 
      ? data.reduce((max, cat) => cat.id > max.id ? cat : max, data[0]).nombre 
      : null;
    
    return {
      total,
      categoriaMasAntigua,
      categoriaMasReciente,
      nombresCategorias: data.map(cat => cat.nombre)
    };
  }

  // Código original para productos
  const totalProductos = data.length;
  const sinStock = data.filter(p => p.stock === 0).length;
  const stockCritico = data.filter(p => p.stock > 0 && p.stock <= p.stock_critico).length;
  const stockNormal = data.filter(p => p.stock > p.stock_critico).length;

  // Calcular número de categorías únicas
  const categoriasUnicas = new Set(data.map(p => p.categoria));
  const numeroCategorias = categoriasUnicas.size;

  return {
    totalProductos,
    sinStock,
    stockCritico,
    stockNormal,
    categorias: numeroCategorias // Agregar el número de categorías
    // Eliminar valorTotalInventario ya que no se necesita
  };
};

// ====================================================================
// FUNCIONES ESPECÍFICAS PARA CATEGORÍAS
// ====================================================================

/**
 * Genera reporte de categorías en formato CSV o JSON
 */
export const generarReporteCategorias = (categorias, formato = 'csv') => {
  const fecha = formatearFecha();
  
  try {
    let contenido, nombreArchivo, tipoMIME;

    if (formato === 'csv') {
      contenido = generarReporteCSV(categorias, 'categorias');
      nombreArchivo = `reporte_categorias_${fecha}.csv`;
      tipoMIME = 'text/csv;charset=utf-8;';
    } else if (formato === 'csv-excel') {
      contenido = generarReporteCSVExcel(categorias, 'categorias');
      nombreArchivo = `reporte_categorias_${fecha}.csv`;
      tipoMIME = 'text/csv;charset=utf-8;';
    } else {
      contenido = generarReporteJSON(categorias, 'categorias');
      nombreArchivo = `reporte_categorias_${fecha}.json`;
      tipoMIME = 'application/json;charset=utf-8;';
    }

    descargarArchivo(contenido, nombreArchivo, tipoMIME);

    // Retornar estadísticas para mostrar en modal si es necesario
    return generarEstadisticas(categorias, 'categorias');

  } catch (error) {
    console.error('Error al generar reporte de categorías:', error);
    throw new Error('Error al generar el reporte. Por favor, intenta nuevamente.');
  }
};

/**
 * Función específica para manejar reporte de categorías desde la página de gestión
 */
export const manejarReporteCategorias = (categoriasFiltradas, formato) => {
  const estadisticas = generarEstadisticas(categoriasFiltradas, 'categorias');
  
  if (formato === 'json') {
    const confirmar = window.confirm(`
ESTADÍSTICAS DEL REPORTE DE CATEGORÍAS:

• Total de categorías: ${estadisticas.total}
• Categoría más antigua (menor ID): ${estadisticas.categoriaMasAntigua || 'N/A'}
• Categoría más reciente (mayor ID): ${estadisticas.categoriaMasReciente || 'N/A'}

¿Deseas descargar el reporte en formato JSON?
    `.trim());

    if (confirmar) {
      generarReporteCategorias(categoriasFiltradas, 'json');
    }
  } else {
    // Para CSV mostrar modal o ejecutar directamente
    generarReporteCategorias(categoriasFiltradas, formato);
  }
};

// ====================================================================
// FUNCIONES PARA ÓRDENES - AGREGADAS
// ====================================================================

/**
 * Genera reporte de órdenes en formato CSV o JSON (versión mejorada)
 */
export const generarReporteOrdenes = async (formato, ordenesParam = null) => {
  const fecha = formatearFecha();

  try {
    // Obtener órdenes - usar las proporcionadas o cargar desde app_ordenes
    let ordenes = ordenesParam;
    if (!ordenes || !Array.isArray(ordenes)) {
      console.log('Obteniendo órdenes desde app_ordenes...');
      ordenes = await obtenerOrdenesDesdeAppOrdenes();
    }

    // Validar que ordenes sea un array
    if (!Array.isArray(ordenes)) {
      console.error('Error: ordenes no es un array:', ordenes);
      ordenes = [];
    }

    console.log('Órdenes para reporte:', ordenes.length, 'elementos');

    // Obtener estadísticas actualizadas
    const estadisticas = generarEstadisticasOrdenes(ordenes);

    let contenido, nombreArchivo, tipoMIME;

    if (formato === 'csv') {
      contenido = generarCSVOrdenes(ordenes);
      nombreArchivo = `reporte_ordenes_${fecha}.csv`;
      tipoMIME = 'text/csv;charset=utf-8;';
    } else if (formato === 'csv-excel') {
      contenido = generarCSVOrdenesExcel(ordenes);
      nombreArchivo = `reporte_ordenes_${fecha}.csv`;
      tipoMIME = 'text/csv;charset=utf-8;';
    } else {
      contenido = generarJSONOrdenes(ordenes, estadisticas);
      nombreArchivo = `reporte_ordenes_${fecha}.json`;
      tipoMIME = 'application/json;charset=utf-8;';
    }

    descargarArchivo(contenido, nombreArchivo, tipoMIME);

  } catch (error) {
    console.error('Error al generar reporte:', error);
    alert('Error al generar el reporte. Por favor, intenta nuevamente.');
  }
};

/**
 * Genera CSV estándar para órdenes
 */
/**
 * Genera CSV estándar para órdenes CON CODIFICACIÓN UTF-8 CORRECTA
 */
const generarCSVOrdenes = (ordenes) => {
  // Agregar BOM para UTF-8 (importante para Excel y tildes)
  const BOM = '\uFEFF';

  const headers = ['Número Orden', 'Fecha', 'RUN Cliente', 'Estado', 'Total', 'Cantidad Productos'];
  let csv = headers.join(',') + '\n';

  ordenes.forEach(orden => {
    const row = [
      `"${orden.numeroOrden}"`,
      `"${orden.fecha}"`,
      `"${orden.run}"`,
      `"${orden.estadoEnvio}"`,
      orden.total,
      orden.productos ? orden.productos.length : 0
    ];
    csv += row.join(',') + '\n';
  });

  return BOM + csv;
};

/**
 * Genera CSV optimizado para Excel CON MEJOR CODIFICACIÓN
 */
const generarCSVOrdenesExcel = (ordenes) => {
  const BOM = '\uFEFF';

  const headers = ['Número Orden', 'Fecha', 'RUN Cliente', 'Estado', 'Total', 'Cantidad Productos'];
  let csv = BOM + headers.join(';') + '\n';

  ordenes.forEach(orden => {
    const row = [
      orden.numeroOrden,
      orden.fecha,
      orden.run,
      orden.estadoEnvio,
      orden.total ? orden.total.toString().replace('.', ',') : '0',
      orden.productos ? orden.productos.length : 0
    ];
    csv += row.join(';') + '\n';
  });

  return csv;
};


/**
 * Genera JSON con metadata para órdenes
 */
const generarJSONOrdenes = (ordenes, estadisticas) => {
  const reporte = {
    metadata: {
      fechaGeneracion: new Date().toISOString(),
      totalOrdenes: estadisticas.totalOrdenes,
      resumen: {
        pendientes: estadisticas.pendientes,
        enviadas: estadisticas.enviadas,
        entregadas: estadisticas.entregadas,
        canceladas: estadisticas.canceladas,
        ingresosTotales: estadisticas.ingresosTotales
      }
    },
    ordenes: ordenes
  };

  return JSON.stringify(reporte, null, 2);
};

/**
 * Calcula estadísticas para órdenes (para usar en el modal de reportes)
 */
export const generarEstadisticasOrdenes = (ordenes) => {
  // Asegurar que ordenes sea un array
  if (!Array.isArray(ordenes)) {
    console.warn('generarEstadisticasOrdenes: ordenes no es un array, usando array vacío');
    ordenes = [];
  }

  const totalOrdenes = ordenes.length;
  const pendientes = ordenes.filter(o => o.estadoEnvio === 'Pendiente').length;
  const enviadas = ordenes.filter(o => o.estadoEnvio === 'Enviado').length;
  const entregadas = ordenes.filter(o => o.estadoEnvio === 'Entregado').length;
  const canceladas = ordenes.filter(o => o.estadoEnvio === 'Cancelado').length;
  const ingresosTotales = ordenes
    .filter(o => o.estadoEnvio === 'Entregado')
    .reduce((sum, orden) => sum + (orden.total || 0), 0);

  return {
    totalOrdenes,
    pendientes,
    enviadas,
    entregadas,
    canceladas,
    ingresosTotales: formatCurrency(ingresosTotales)
  };
};

// ====================================================================
// FUNCIONES PARA USUARIOS - AGREGADAS
// ====================================================================

/**
 * Genera reporte de usuarios en formato CSV o JSON (versión mejorada)
 */
export const generarReporteUsuarios = async (formato, usuariosParam = null, estadisticasParam = null) => {
  const fecha = formatearFecha();

  try {
    // Obtener usuarios - usar los proporcionados o cargar desde app_usuarios
    let usuarios = usuariosParam;
    let estadisticas = estadisticasParam;

    if (!usuarios || !Array.isArray(usuarios)) {
      const usuarioService = await import('./usuarioService');
      usuarios = await usuarioService.usuarioService.getUsuarios();
    }

    if (!estadisticas) {
      // Calcular estadísticas actualizadas
      const usuarioStats = await import('./usuarioStats');
      estadisticas = usuarioStats.calcularEstadisticasUsuarios(usuarios);
    }

    let contenido, nombreArchivo, tipoMIME;

    if (formato === 'csv') {
      contenido = generarCSVUsuarios(usuarios);
      nombreArchivo = `reporte_usuarios_${fecha}.csv`;
      tipoMIME = 'text/csv;charset=utf-8;';
    } else if (formato === 'csv-excel') {
      contenido = generarCSVUsuariosExcel(usuarios);
      nombreArchivo = `reporte_usuarios_${fecha}.csv`;
      tipoMIME = 'text/csv;charset=utf-8;';
    } else {
      contenido = generarJSONUsuarios(usuarios, estadisticas);
      nombreArchivo = `reporte_usuarios_${fecha}.json`;
      tipoMIME = 'application/json;charset=utf-8;';
    }

    descargarArchivo(contenido, nombreArchivo, tipoMIME);

  } catch (error) {
    console.error('Error al generar reporte:', error);
    alert('Error al generar el reporte. Por favor, intenta nuevamente.');
  }
};

/**
 * Genera CSV estándar para usuarios
 */
const generarCSVUsuarios = (usuarios) => {
  const BOM = '\uFEFF';
  const headers = ['RUN', 'Nombre', 'Apellidos', 'Email', 'Teléfono', 'Tipo', 'Total Compras', 'Total Gastado', 'Región', 'Comuna'];
  let csv = headers.join(',') + '\n';

  usuarios.forEach(usuario => {
    const row = [
      `"${usuario.run}"`,
      `"${usuario.nombre}"`,
      `"${usuario.apellidos}"`,
      `"${usuario.correo}"`,
      `"${usuario.telefono}"`,
      `"${usuario.tipo}"`,
      usuario.totalCompras || 0,
      usuario.totalGastado || 0,
      `"${usuario.region}"`,
      `"${usuario.comuna}"`
    ];
    csv += row.join(',') + '\n';
  });

  return BOM + csv;
};

/**
 * Genera CSV optimizado para Excel
 */
const generarCSVUsuariosExcel = (usuarios) => {
  const BOM = '\uFEFF';
  const headers = ['RUN', 'Nombre', 'Apellidos', 'Email', 'Teléfono', 'Tipo', 'Total Compras', 'Total Gastado', 'Región', 'Comuna'];
  let csv = '\uFEFF' + headers.join(';') + '\n';

  usuarios.forEach(usuario => {
    const row = [
      usuario.run,
      usuario.nombre,
      usuario.apellidos,
      usuario.correo,
      usuario.telefono,
      usuario.tipo,
      usuario.totalCompras || 0,
      (usuario.totalGastado || 0).toString().replace('.', ','),
      usuario.region,
      usuario.comuna
    ];
    csv += row.join(';') + '\n';
  });

  return BOM + csv;
};

/**
 * Genera JSON con metadata para usuarios
 */
const generarJSONUsuarios = (usuarios, estadisticas) => {
  // Crear copia de usuarios sin la contraseña y sin estado
  const usuariosSeguros = usuarios.map(usuario => {
    const { contrasenha, estado, ...usuarioSeguro } = usuario;
    return usuarioSeguro;
  });

  const reporte = {
    metadata: {
      fechaGeneracion: new Date().toISOString(),
      totalUsuarios: estadisticas.totalUsuarios,
      resumen: {
        totalClientes: estadisticas.totalClientes,
        totalAdmins: estadisticas.totalAdmins,
        usuariosConCompras: estadisticas.usuariosConCompras,
        ingresosTotales: estadisticas.totalIngresos
      },
      seguridad: {
        camposExcluidos: ["contrasenha", "estado"],
        nota: "Información sensible ha sido excluida por seguridad"
      }
    },
    usuarios: usuariosSeguros
  };

  return JSON.stringify(reporte, null, 2);
};

// ====================================================================
// FUNCIONES DE COMPATIBILIDAD (para mantener funcionamiento existente)
// ====================================================================

/**
 * Función de compatibilidad para reporte de órdenes (mantener funcionamiento existente)
 * @deprecated Usar generarReporteOrdenes(formato, ordenesParam) en su lugar
 */
export const generarReporteOrdenesLegacy = (ordenes, formato, estadisticas) => {
  console.warn('generarReporteOrdenesLegacy está deprecado. Usar generarReporteOrdenes(formato, ordenesParam) en su lugar.');
  generarReporteOrdenes(formato, ordenes);
};

/**
 * Función de compatibilidad para reporte de usuarios (mantener funcionamiento existente)
 * @deprecated Usar generarReporteUsuarios(formato, usuariosParam, estadisticasParam) en su lugar
 */
export const generarReporteUsuariosLegacy = (usuarios, formato, estadisticas) => {
  console.warn('generarReporteUsuariosLegacy está deprecado. Usar generarReporteUsuarios(formato, usuariosParam, estadisticasParam) en su lugar.');
  generarReporteUsuarios(formato, usuarios, estadisticas);
};

// ====================================================================
// FUNCIONES DE VALIDACIÓN Y UTILIDAD GENERAL
// ====================================================================

/**
 * Valida si los datos son adecuados para generar reporte
 */
export const validarDatosReporte = (data, tipo = 'productos') => {
  if (!Array.isArray(data)) {
    return { valido: false, mensaje: 'Los datos no son un array válido' };
  }
  
  if (data.length === 0) {
    return { valido: false, mensaje: 'No hay datos para generar el reporte' };
  }
  
  if (tipo === 'categorias') {
    const datosInvalidos = data.filter(cat => 
      !cat.id || !cat.nombre || typeof cat.nombre !== 'string'
    );
    
    if (datosInvalidos.length > 0) {
      return { 
        valido: false, 
        mensaje: `Hay ${datosInvalidos.length} categorías con datos inválidos` 
      };
    }
  } else if (tipo === 'productos') {
    const datosInvalidos = data.filter(prod => 
      !prod.codigo || !prod.nombre || prod.precio === undefined
    );
    
    if (datosInvalidos.length > 0) {
      return { 
        valido: false, 
        mensaje: `Hay ${datosInvalidos.length} productos con datos inválidos` 
      };
    }
  }
  
  return { valido: true, mensaje: 'Datos válidos para reporte' };
};

/**
 * Calcula métricas adicionales para el dashboard
 */
export const calcularMetricas = (data, tipo = 'productos') => {
  if (!Array.isArray(data)) return {};
  
  if (tipo === 'categorias') {
    return {
      total: data.length,
      conProductos: 0, // Esto requeriría consultar productos por categoría
      sinProductos: data.length
    };
  }
  
  // Métricas para productos
  const productosCriticos = data.filter(p => 
    p.stock > 0 && p.stock <= p.stock_critico
  );
  
  const productosSinStock = data.filter(p => p.stock === 0);
  
  const valorInventario = data.reduce((sum, p) => 
    sum + ((p.precio || 0) * (p.stock || 0)), 0
  );
  
  return {
    productosCriticos: productosCriticos.length,
    productosSinStock: productosSinStock.length,
    valorInventario
  };
};

/**
 * Formatea un número como moneda chilena
 */
export const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(valor);
};

/**
 * Genera un resumen ejecutivo para mostrar en modales
 */
export const generarResumen = (data, tipo = 'productos') => {
  const estadisticas = generarEstadisticas(data, tipo);
  
  if (tipo === 'categorias') {
    return {
      titulo: 'Resumen de Categorías',
      total: estadisticas.total,
      masAntigua: estadisticas.categoriaMasAntigua,
      masReciente: estadisticas.categoriaMasReciente
    };
  } else if (tipo === 'productos') {
    return {
      titulo: 'Resumen de Productos',
      totalProductos: estadisticas.totalProductos,
      productosCriticos: estadisticas.stockCritico,
      productosSinStock: estadisticas.sinStock,
      categoriasUnicas: estadisticas.categorias
    };
  }
  
  return {};
};