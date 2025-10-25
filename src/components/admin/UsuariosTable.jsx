// src/components/admin/UsuariosTable.jsx
import { formatCurrency, formatDate } from '../../utils/admin/dashboardUtils';

const UsuariosTable = ({ usuarios, onEdit, onDelete }) => {
  
  const handleEliminarUsuario = async (usuario) => {
    const mensajeConfirmacion = `
¿Estás seguro de que quieres eliminar al usuario?

• Nombre: ${usuario.nombre} ${usuario.apellidos}
• RUN: ${usuario.run}
• Email: ${usuario.correo}
• Tipo: ${usuario.tipo}
• Compras realizadas: ${usuario.totalCompras}

⚠️ Esta acción no se puede deshacer.
    `.trim();

    if (window.confirm(mensajeConfirmacion)) {
      try {
        const resultado = await onDelete(usuario.run);
        if (!resultado.success) {
          alert(`Error al eliminar usuario: ${resultado.error}`);
        }
      } catch (error) {
        alert('Error inesperado al eliminar el usuario');
      }
    }
  };

  const getTipoBadgeClass = (tipo) => {
    return tipo === 'Admin' ? 'bg-danger text-white' : 'bg-info text-white';
  };

  const getComprasBadgeClass = (compras) => {
    if (compras === 0) return 'bg-secondary text-white';
    if (compras <= 2) return 'bg-primary text-white';
    return 'bg-success text-white';
  };

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Lista de Usuarios</h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
            <thead className="thead-light">
              <tr>
                <th>RUN</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Compras</th>
                <th>Total Gastado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.run}>
                  <td>
                    <strong>{usuario.run}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{usuario.nombre} {usuario.apellidos}</strong>
                      <br />
                      <small className="text-muted">{usuario.direccion}</small>
                    </div>
                  </td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    <span className={`badge ${getTipoBadgeClass(usuario.tipo)}`}>
                      {usuario.tipo}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getComprasBadgeClass(usuario.totalCompras)}`}>
                      {usuario.totalCompras} compra(s)
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(usuario.totalGastado)}</strong>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-primary"
                        onClick={() => onEdit(usuario)}
                        title="Ver detalles"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleEliminarUsuario(usuario)}
                        title="Eliminar usuario"
                        disabled={usuario.tipo === 'Admin'}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    {/* Mensaje informativo */}
                    {usuario.tipo === 'Admin' && (
                      <small className="text-danger d-block mt-1">
                        No se puede eliminar
                      </small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {usuarios.length === 0 && (
          <div className="text-center py-4">
            <i className="bi bi-people fa-3x text-muted mb-3"></i>
            <p className="text-muted">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosTable;