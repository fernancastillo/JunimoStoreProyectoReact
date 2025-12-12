import { useState, useEffect } from 'react';
import { useCategorias } from '../../utils/admin/useCategorias';
import CategoriasTable from '../../components/admin/CategoriasTable';
import CategoriaModal from '../../components/admin/CategoriaModal';
import CategoriasFiltros from '../../components/admin/CategoriasFiltros';
import ReporteModal from '../../components/admin/ReporteModal';
import {
  generarReporteCategorias,
  manejarReporteCategorias,
  formatearFecha
} from '../../utils/admin/reportUtils';

const SuccessAlert = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div className="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg"
      style={{ zIndex: 9999, minWidth: '300px' }} role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-check-circle-fill me-2 fs-5"></i>
        <strong>{message}</strong>
        <button
          type="button"
          className="btn-close ms-2"
          onClick={onClose}
          aria-label="Cerrar"
        ></button>
      </div>
    </div>
  );
};

const Categorias = () => {
  const {
    categorias,
    categoriasFiltradas,
    loading,
    error,
    editingCategoria,
    showModal,
    filtros,
    successMessage,
    showSuccessMessage,
    clearSuccessMessage,
    handleDelete,
    handleEdit,
    handleCreateNew,
    handleCloseModal,
    handleSave,
    handleFiltroChange,
    handleLimpiarFiltros,
    nombreCategoriaExiste
  } = useCategorias();

  const [showReporteModal, setShowReporteModal] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    // Fondo idéntico a la página de Productos
    document.body.style.backgroundImage = 'url("../src/assets/tienda/fondostardew.png")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.minHeight = '';
    };
  }, []);

  const handleSaveWithError = async (categoriaData) => {
    try {
      setActionError('');
      const result = await handleSave(categoriaData);

      if (!result.success) {
        setActionError(result.error);
      }
    } catch (error) {
      setActionError(`Error: ${error.message}`);
    }
  };

  const handleDeleteWithConfirm = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?\n\nNota: No se pueden eliminar categorías que tengan productos asociados.')) {
      try {
        setActionError('');
        const result = await handleDelete(id);

        if (!result.success) {
          setActionError(result.error);
        }
      } catch (error) {
        setActionError(`Error: ${error.message}`);
      }
    }
  };

  const handleCerrarModalReporte = () => {
    setShowReporteModal(false);
  };

  if (loading) {
    return (
      <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Cargando categorías...</span>
          </div>
          <span className="ms-2 text-white">Cargando categorías desde Oracle...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
        <div className="alert alert-danger">
          <h4>Error al cargar categorías</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>

      <SuccessAlert
        message={successMessage}
        show={showSuccessMessage}
        onClose={clearSuccessMessage}
      />

      {actionError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {actionError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionError('')}
          ></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-white fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          <i className="bi bi-tags me-2"></i>
          Gestión de Categorías
        </h1>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-success shadow"
            onClick={handleCreateNew}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Categoría
          </button>
          <button
            className="btn btn-primary shadow"
            onClick={() => manejarReporteCategorias(categoriasFiltradas, 'csv')}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Reporte CSV
          </button>
          <button
            className="btn btn-warning shadow"
            onClick={() => manejarReporteCategorias(categoriasFiltradas, 'json')}
          >
            <i className="bi bi-file-code me-2"></i>
            Reporte JSON
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Categorías Filtradas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {categoriasFiltradas.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-filter-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Categorías
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {categorias.length}
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

      <CategoriasFiltros
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onLimpiarFiltros={handleLimpiarFiltros}
        resultados={{
          filtrados: categoriasFiltradas.length,
          totales: categorias.length
        }}
      />

      <CategoriasTable
        categorias={categoriasFiltradas}
        onEdit={handleEdit}
        onDelete={handleDeleteWithConfirm}
      />

      <CategoriaModal
        show={showModal}
        categoria={editingCategoria}
        nombreCategoriaExiste={nombreCategoriaExiste}
        onSave={handleSaveWithError}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Categorias;