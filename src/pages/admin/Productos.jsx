import { useState } from 'react';
import { useProductos } from '../../utils/admin/useProductos';
import ProductosTable from '../../components/admin/ProductosTable';
import ProductoModal from '../../components/admin/ProductoModal';
import ReporteModal from '../../components/admin/ReporteModal';
import { 
  generarReporteCSV, 
  generarReporteCSVExcel,
  generarReporteJSON, 
  descargarArchivo,
  generarEstadisticas,
  formatearFecha 
} from '../../utils/admin/reportUtils';

const Productos = () => {
  const {
    productos,
    categorias,
    loading,
    editingProducto,
    showModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCreateNew,
    handleCloseModal,
    getCodigoAutomatico,
    actualizarCategorias
  } = useProductos();

  // Estado para controlar el modal de reportes
  const [showReporteModal, setShowReporteModal] = useState(false);

  const handleSave = (productoData) => {
    if (editingProducto) {
      const result = handleUpdate(editingProducto.codigo, productoData);
      if (!result.success) {
        alert(result.error);
      } else {
        setTimeout(() => {
          actualizarCategorias();
        }, 100);
      }
    } else {
      const result = handleCreate(productoData);
      if (!result.success) {
        alert(result.error);
      } else {
        setTimeout(() => {
          actualizarCategorias();
        }, 100);
      }
    }
  };

  // Función para generar reportes
  const handleGenerarReporte = (formato = 'csv') => {
    try {
      const fecha = formatearFecha();
      let contenido, nombreArchivo, tipoMIME;

      if (formato === 'csv') {
        contenido = generarReporteCSV(productos);
        nombreArchivo = `reporte_productos_${fecha}.csv`;
        tipoMIME = 'text/csv;charset=utf-8;';
      } else if (formato === 'csv-excel') {
        contenido = generarReporteCSVExcel(productos);
        nombreArchivo = `reporte_productos_${fecha}.csv`;
        tipoMIME = 'text/csv;charset=utf-8;';
      } else {
        contenido = generarReporteJSON(productos);
        nombreArchivo = `reporte_productos_${fecha}.json`;
        tipoMIME = 'application/json;charset=utf-8;';
      }

      descargarArchivo(contenido, nombreArchivo, tipoMIME);
      
      const estadisticas = generarEstadisticas(productos);
      console.log('Estadísticas del reporte:', estadisticas);
      
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte. Por favor, intenta nuevamente.');
    }
  };

  // Función para manejar selección de formato CSV
  const handleSeleccionCSV = (formato) => {
    handleGenerarReporte(formato);
  };

  // Función para abrir modal de selección CSV
  const handleAbrirModalCSV = () => {
    setShowReporteModal(true);
  };

  // Función para cerrar modal de reportes
  const handleCerrarModalReporte = () => {
    setShowReporteModal(false);
  };

  // Función para manejar reporte JSON
  const handleReporteJSON = () => {
    const estadisticas = generarEstadisticas(productos);
    
    const confirmar = window.confirm(`
ESTADÍSTICAS DEL REPORTE:

• Total de productos: ${estadisticas.totalProductos}
• Sin stock: ${estadisticas.sinStock}
• Stock crítico: ${estadisticas.stockCritico}
• Stock normal: ${estadisticas.stockNormal}
• Valor total del inventario: ${estadisticas.valorTotalInventario}

¿Deseas descargar el reporte en formato JSON?
    `.trim());

    if (confirmar) {
      handleGenerarReporte('json');
    }
  };

  // unción principal para manejar reportes
  const handleReporteSolicitado = (formato) => {
    if (formato === 'csv') {
      handleAbrirModalCSV();
    } else {
      handleReporteJSON();
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  const estadisticas = generarEstadisticas(productos);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Gestión de Productos</h1>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => handleReporteSolicitado('csv')}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Reporte CSV
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleReporteSolicitado('json')}
          >
            <i className="bi bi-file-code me-2"></i>
            Reporte JSON
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreateNew}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Productos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {productos.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-box-seam fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Stock Crítico
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {productos.filter(p => p.stock <= p.stock_critico).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-exclamation-triangle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Sin Stock
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {productos.filter(p => p.stock === 0).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-x-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Categorías
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {new Set(productos.map(p => p.categoria)).size}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-tags fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductosTable
        productos={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerarReporte={handleReporteSolicitado}
      />

      {/* Modal para agregar/editar productos */}
      <ProductoModal
        show={showModal}
        producto={editingProducto}
        categorias={categorias}
        getCodigoAutomatico={getCodigoAutomatico}
        onSave={handleSave}
        onClose={handleCloseModal}
      />

      {/* Modal para selección de formato de reporte */}
      <ReporteModal
        show={showReporteModal}
        estadisticas={estadisticas}
        onSeleccionarFormato={handleSeleccionCSV}
        onClose={handleCerrarModalReporte}
      />
    </div>
  );
};

export default Productos;