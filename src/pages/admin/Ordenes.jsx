// pages/admin/Ordenes.jsx
import { useState } from 'react';
import OrdenesStats from '../../components/admin/OrdenesStats';
import OrdenesFiltros from '../../components/admin/OrdenesFiltros';
import OrdenesTable from '../../components/admin/OrdenesTable';
import OrdenModal from '../../components/admin/OrdenModal';
import ReporteModal from '../../components/admin/ReporteModal';
import { useOrdenes } from '../../utils/admin/useOrdenes';
import { generarReporteOrdenes } from '../../utils/admin/reportUtils';

const Ordenes = () => {
  const {
    ordenes,
    ordenesFiltradas,
    loading,
    editingOrden,
    showModal,
    filtros,
    estadisticas,
    handleEdit,
    handleUpdateEstado,
    handleCloseModal,
    handleFiltroChange,
    handleLimpiarFiltros
  } = useOrdenes();

  const [showReporteModal, setShowReporteModal] = useState(false);

  const handleGenerarReporte = (formato) => {
    if (formato === 'csv') {
      setShowReporteModal(true);
    } else {
      generarReporteOrdenes(ordenesFiltradas, formato, estadisticas);
    }
  };

  const handleSeleccionFormato = (formato) => {
    generarReporteOrdenes(ordenesFiltradas, formato, estadisticas);
    setShowReporteModal(false);
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

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Gestión de Órdenes</h1>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => handleGenerarReporte('csv')}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Reporte CSV
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleGenerarReporte('json')}
          >
            <i className="bi bi-file-code me-2"></i>
            Reporte JSON
          </button>
        </div>
      </div>

      {/* Estadísticas - Componente separado */}
      <OrdenesStats estadisticas={estadisticas} />

      {/* Filtros - Componente separado */}
      <OrdenesFiltros
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onLimpiarFiltros={handleLimpiarFiltros}
        resultados={{
          filtradas: ordenesFiltradas.length,
          totales: ordenes.length
        }}
      />

      {/* Tabla de órdenes */}
      <OrdenesTable
        ordenes={ordenesFiltradas}
        onEdit={handleEdit}
        onUpdateEstado={handleUpdateEstado}
      />

      {/* Modal para ver detalles de orden */}
      <OrdenModal
        show={showModal}
        orden={editingOrden}
        onClose={handleCloseModal}
        onUpdateEstado={handleUpdateEstado}
      />

      {/* Modal de reportes (reutilizado) */}
      <ReporteModal
        show={showReporteModal}
        estadisticas={estadisticas}
        onSeleccionarFormato={handleSeleccionFormato}
        onClose={() => setShowReporteModal(false)}
      />
    </div>
  );
};

export default Ordenes;