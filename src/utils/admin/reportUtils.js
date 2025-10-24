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