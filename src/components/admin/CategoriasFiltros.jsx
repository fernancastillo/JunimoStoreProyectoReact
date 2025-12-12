const CategoriasFiltros = ({ filtros, onFiltroChange, onLimpiarFiltros, resultados }) => {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">
          <i className="bi bi-funnel me-2"></i>
          Filtros y Ordenamiento de Categorías
        </h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {/* Filtro por ID */}
          <div className="col-md-4">
            <label className="form-label small fw-bold">ID de Categoría</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="id"
              value={filtros.id}
              onChange={onFiltroChange}
              placeholder="Buscar por ID..."
            />
          </div>
          
          {/* Filtro por Nombre */}
          <div className="col-md-4">
            <label className="form-label small fw-bold">Nombre</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="nombre"
              value={filtros.nombre}
              onChange={onFiltroChange}
              placeholder="Buscar por nombre..."
            />
          </div>
          
          {/* Ordenamiento */}
          <div className="col-md-3">
            <label className="form-label small fw-bold">Ordenar por</label>
            <select
              className="form-select form-select-sm"
              name="ordenarPor"
              value={filtros.ordenarPor}
              onChange={onFiltroChange}
            >
              <option value="id">ID (Ascendente)</option>
              <option value="id-desc">ID (Descendente)</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
            </select>
          </div>
          
          {/* Botón Limpiar Filtros */}
          <div className="col-md-1 text-end">
            <button
              className="btn btn-outline-secondary btn-sm mt-4"
              onClick={onLimpiarFiltros}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Limpiar
            </button>
          </div>
        </div>

        {/* Resultados del filtro */}
        <div className="row mt-3">
          <div className="col-12">
            <div className="alert alert-info py-2 mb-0" role="alert">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-info-circle me-2"></i>
                  Mostrando <strong>{resultados.filtrados}</strong> de <strong>{resultados.totales}</strong> categorías
                </div>
                {resultados.filtrados !== resultados.totales && (
                  <span className="badge bg-warning">
                    Filtrado aplicado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriasFiltros;