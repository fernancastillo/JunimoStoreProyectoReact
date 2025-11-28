const ProductosFiltros = ({ filtros, onFiltroChange, onLimpiarFiltros, resultados, categorias }) => {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">
          <i className="bi bi-funnel me-2"></i>
          Filtros y Ordenamiento de Productos
        </h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {/* Filtro por Código */}
          <div className="col-md-2">
            <label className="form-label small fw-bold">Código</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="codigo"
              value={filtros.codigo}
              onChange={onFiltroChange}
              placeholder="Buscar por código..."
            />
          </div>
          
          {/* Filtro por Nombre */}
          <div className="col-md-2">
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
          
          {/* Filtro por Categoría */}
          <div className="col-md-2">
            <label className="form-label small fw-bold">Categoría</label>
            <select
              className="form-select form-select-sm"
              name="categoria"
              value={filtros.categoria}
              onChange={onFiltroChange}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por Estado de Stock */}
          <div className="col-md-2">
            <label className="form-label small fw-bold">Estado Stock</label>
            <select
              className="form-select form-select-sm"
              name="estadoStock"
              value={filtros.estadoStock}
              onChange={onFiltroChange}
            >
              <option value="">Todos los estados</option>
              <option value="sin-stock">Sin Stock</option>
              <option value="critico">Stock Crítico</option>
              <option value="normal">Stock Normal</option>
            </select>
          </div>
          
          {/* Filtro por Precio Mínimo */}
          <div className="col-md-2">
            <label className="form-label small fw-bold">Precio Mín.</label>
            <input
              type="number"
              className="form-control form-control-sm"
              name="precioMin"
              value={filtros.precioMin}
              onChange={onFiltroChange}
              placeholder="Precio mínimo"
              min="0"
            />
          </div>
          
          {/* Filtro por Precio Máximo */}
          <div className="col-md-2">
            <label className="form-label small fw-bold">Precio Máx.</label>
            <input
              type="number"
              className="form-control form-control-sm"
              name="precioMax"
              value={filtros.precioMax}
              onChange={onFiltroChange}
              placeholder="Precio máximo"
              min="0"
            />
          </div>
        </div>

        {/* Segunda fila de filtros */}
        <div className="row g-3 mt-2">
          {/* Filtro por Stock Mínimo */}
          <div className="col-md-2">
            <label className="form-label small fw-bold">Stock Mínimo</label>
            <input
              type="number"
              className="form-control form-control-sm"
              name="stockMin"
              value={filtros.stockMin}
              onChange={onFiltroChange}
              placeholder="Stock mínimo"
              min="0"
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
              <option value="nombre">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="precio-asc">Precio (Menor a mayor)</option>
              <option value="precio-desc">Precio (Mayor a menor)</option>
              <option value="stock-asc">Stock (Menor a mayor)</option>
              <option value="stock-desc">Stock (Mayor a menor)</option>
              <option value="codigo">Código (A-Z)</option>
            </select>
          </div>
          
          {/* Botón Limpiar Filtros */}
          <div className="col-md-1 text-end">
            <button
              className="btn btn-outline-secondary btn-sm mt-4"
              onClick={onLimpiarFiltros}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosFiltros;