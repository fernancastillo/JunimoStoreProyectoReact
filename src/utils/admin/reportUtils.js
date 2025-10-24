import { formatCurrency } from './dashboardUtils';

/**
 * Formatea la fecha en formato DD-MM-YYYY
 */
export const formatearFecha = () => {
  const ahora = new Date();
  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
  const año = ahora.getFullYear();
  return `${dia}-${mes}-${año}`;
};

/**
 * Genera un reporte de productos en formato CSV compatible con Excel
 */
export const generarReporteCSV = (productos) => {
  // Agregar BOM para UTF-8 (importante para Excel)
  const BOM = '\uFEFF';
  
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

  const rows = productos.map(producto => {
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
export const generarReporteCSVExcel = (productos) => {
  const BOM = '\uFEFF';
  
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

  const rows = productos.map(producto => {
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
export const generarReporteJSON = (productos) => {
  const reporte = {
    fechaGeneracion: new Date().toISOString(),
    totalProductos: productos.length,
    productos: productos.map(producto => ({
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
  const blob = new Blob([contenido], { type: tipoMIME });
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
 * Genera estadísticas para el reporte
 */
export const generarEstadisticas = (productos) => {
  const totalProductos = productos.length;
  const sinStock = productos.filter(p => p.stock === 0).length;
  const stockCritico = productos.filter(p => p.stock > 0 && p.stock <= p.stock_critico).length;
  const stockNormal = productos.filter(p => p.stock > p.stock_critico).length;
  
  const productosPorCategoria = productos.reduce((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});

  const valorTotalInventario = productos.reduce((total, producto) => 
    total + (producto.precio * producto.stock), 0
  );

  return {
    totalProductos,
    sinStock,
    stockCritico,
    stockNormal,
    productosPorCategoria,
    valorTotalInventario: formatCurrency(valorTotalInventario)
  };
};

// ====================================================================
// FUNCIONES PARA ÓRDENES - AGREGADAS
// ====================================================================

/**
 * Genera reporte de órdenes en formato CSV o JSON
 */
export const generarReporteOrdenes = (ordenes, formato, estadisticas) => {
  const fecha = formatearFecha();
  
  try {
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
const generarCSVOrdenes = (ordenes) => {
  const headers = ['Número Orden', 'Fecha', 'RUN Cliente', 'Estado', 'Total', 'Cantidad Productos'];
  let csv = headers.join(',') + '\n';

  ordenes.forEach(orden => {
    const row = [
      `"${orden.numeroOrden}"`,
      `"${orden.fecha}"`,
      `"${orden.run}"`,
      `"${orden.estadoEnvio}"`,
      orden.total,
      orden.productos.length
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
};

/**
 * Genera CSV optimizado para Excel
 */
const generarCSVOrdenesExcel = (ordenes) => {
  const headers = ['Número Orden', 'Fecha', 'RUN Cliente', 'Estado', 'Total', 'Cantidad Productos'];
  let csv = '\uFEFF' + headers.join(';') + '\n'; // BOM para Excel

  ordenes.forEach(orden => {
    const row = [
      orden.numeroOrden,
      orden.fecha,
      orden.run,
      orden.estadoEnvio,
      orden.total.toString().replace('.', ','),
      orden.productos.length
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
  const totalOrdenes = ordenes.length;
  const pendientes = ordenes.filter(o => o.estadoEnvio === 'Pendiente').length;
  const enviadas = ordenes.filter(o => o.estadoEnvio === 'Enviado').length;
  const entregadas = ordenes.filter(o => o.estadoEnvio === 'Entregado').length;
  const canceladas = ordenes.filter(o => o.estadoEnvio === 'Cancelado').length;
  const ingresosTotales = ordenes
    .filter(o => o.estadoEnvio === 'Entregado')
    .reduce((sum, orden) => sum + orden.total, 0);

  return {
    totalOrdenes,
    pendientes,
    enviadas,
    entregadas,
    canceladas,
    ingresosTotales: formatCurrency(ingresosTotales)
  };
};