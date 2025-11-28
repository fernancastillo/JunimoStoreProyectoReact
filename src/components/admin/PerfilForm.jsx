import { formatDate } from '../../utils/admin/dashboardUtils';

const PerfilForm = ({ usuario, onEdit, onDelete }) => {
  // Función para obtener la fecha de nacimiento correctamente
  const getFechaNacimiento = () => {
    // Intentar con diferentes nombres de campo
    return usuario.fecha_nacimiento || usuario.fechaNac || null;
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">
          <i className="bi bi-person-vcard me-2"></i>
          Información Personal
        </h6>
        <div>
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={onEdit}
          >
            <i className="bi bi-pencil me-2"></i>
            Editar Perfil
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={onDelete}
          >
            <i className="bi bi-trash me-2"></i>
            Eliminar Perfil
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Columna izquierda */}
          <div className="col-md-6 border-end">
            <div className="mb-4">
              <h6 className="text-primary mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Información Básica
              </h6>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">RUN:</span>
                  <span className="fw-bold text-dark">{usuario.run}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Tipo de Usuario:</span>
                  <span className="badge bg-success">{usuario.tipo}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Nombre:</span>
                  <span className="text-dark">{usuario.nombre}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Apellidos:</span>
                  <span className="text-dark">{usuario.apellidos}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="text-primary mb-3">
                <i className="bi bi-telephone me-2"></i>
                Información de Contacto
              </h6>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Teléfono:</span>
                  <span className="text-dark">{usuario.telefono || 'No especificado'}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Correo:</span>
                  <span className="text-dark">{usuario.correo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-md-6">
            <div className="mb-4">
              <h6 className="text-primary mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                Información de Dirección
              </h6>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Dirección:</span>
                  <span className="text-dark">{usuario.direccion || 'No especificada'}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Comuna:</span>
                  <span className="text-dark">{usuario.comuna || 'No especificada'}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Región:</span>
                  <span className="text-dark">{usuario.region || 'No especificada'}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="text-primary mb-3">
                <i className="bi bi-calendar me-2"></i>
                Información Adicional
              </h6>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Fecha Nacimiento:</span>
                  <span className="text-dark">
                    {getFechaNacimiento() ? formatDate(getFechaNacimiento()) : 'No especificada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilForm;