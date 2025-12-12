import CategoriaForm from './CategoriaForm';

const CategoriaModal = ({ show, categoria, onSave, onClose, nombreCategoriaExiste }) => {
  if (!show) return null;

  const handleSubmit = async (categoriaData) => {
    const result = await onSave(categoriaData);
    
    // Si hubo un error, mantener el modal abierto
    if (!result.success) {
      // El error ya se maneja en el formulario
      return;
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className={`bi ${categoria ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {categoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <CategoriaForm
              categoria={categoria}
              nombreCategoriaExiste={nombreCategoriaExiste}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriaModal;