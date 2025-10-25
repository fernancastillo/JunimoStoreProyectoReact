// src/components/admin/UsuarioCreateModal.jsx
import UsuarioForm from './UsuarioForm';

const UsuarioCreateModal = ({ show, usuario, onSave, onClose }) => {
  if (!show) return null;

  const handleSubmit = (usuarioData) => {
    onSave(usuarioData);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-plus me-2"></i>
              {usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <UsuarioForm
              usuario={usuario}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioCreateModal;