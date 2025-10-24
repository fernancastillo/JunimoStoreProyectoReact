import { formatCurrency } from '../../utils/admin/dashboardUtils';

const ProductosTable = ({ productos, onEdit, onDelete, onGenerarReporte }) => {
  const getStockBadge = (stock, stockCritico) => {
    if (stock === 0) return 'bg-danger';
    if (stock <= stockCritico) return 'bg-warning';
    return 'bg-success';
  };

  const getCategoriaBadge = (categoria) => {
    const categoriasColors = {
      'Accesorios': 'bg-primary',
      'Decoración': 'bg-success',
      'Guías': 'bg-info',
      'Juego De Mesa': 'bg-warning',
      'Mods Digitales': 'bg-secondary',
      'Peluches': 'bg-danger',
      'Polera Personalizada': 'bg-dark'
    };
    return categoriasColors[categoria] || 'bg-secondary';
  };

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Lista de Productos</h6>
        <div>
          <button
            className="btn btn-success btn-sm"
            onClick={() => onGenerarReporte('csv')}
            title="Generar reporte de productos"
          >
            <i className="bi bi-file-earmark-spreadsheet me-1"></i>
            Generar Reporte
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
            <thead className="thead-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock Crítico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>
                    <strong>{producto.codigo}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{producto.nombre}</strong>
                      <br />
                      <small className="text-muted">{producto.descripcion}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getCategoriaBadge(producto.categoria)}`}>
                      {producto.categoria}
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(producto.precio)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${getStockBadge(producto.stock, producto.stock_critico)}`}>
                      {producto.stock} unidades
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {producto.stock_critico}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-primary"
                        onClick={() => onEdit(producto)}
                        title="Editar producto"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(producto.codigo)}
                        title="Eliminar producto"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Botón de reporte al final de la tabla - MEJORADO */}
        <div className="mt-4 p-3 bg-light rounded">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h6 className="mb-1">
                <i className="bi bi-graph-up me-2"></i>
                Reporte de Productos
              </h6>
              <small className="text-muted">
                Genera un reporte completo con estadísticas. Elige el formato que prefieras.
              </small>
            </div>
            <div className="col-md-4 text-end">
              <div className="btn-group-vertical w-100">
                <button
                  className="btn btn-outline-success text-start"
                  onClick={() => onGenerarReporte('csv')}
                  title="Descargar reporte en formato CSV"
                >
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                  Reporte CSV
                  <br />
                  <small className="text-muted">Elige entre estándar o Excel</small>
                </button>
                <button
                  className="btn btn-outline-primary text-start mt-2"
                  onClick={() => onGenerarReporte('json')}
                  title="Descargar reporte en formato JSON"
                >
                  <i className="bi bi-file-code me-2"></i>
                  Reporte JSON
                  <br />
                  <small className="text-muted">Para uso técnico y programación</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosTable;