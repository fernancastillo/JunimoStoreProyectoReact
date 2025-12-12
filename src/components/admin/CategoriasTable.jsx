const CategoriasTable = ({ categorias, onEdit, onDelete, onGenerarReporte }) => {
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

  if (categorias.length === 0) {
    return (
      <div className="card shadow">
        <div className="card-body text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h5 className="mt-3">No hay categorías registradas</h5>
          <p className="text-muted">Comienza agregando una nueva categoría</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>
                    <strong className="text-primary">#{categoria.id}</strong>
                  </td>
                  <td>
                    <span className={`badge ${getCategoriaBadge(categoria.nombre)} fs-6 p-2`}>
                      {categoria.nombre}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(categoria)}
                        title="Editar categoría"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(categoria.id)}
                        title="Eliminar categoría"
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
      </div>
    </div>
  );
};

export default CategoriasTable;