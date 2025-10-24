import { useEffect } from 'react';

const ReporteModal = ({ show, estadisticas, onSeleccionarFormato, onClose }) => {
  useEffect(() => {
    if (show) {
      // Mostrar modal cuando la prop show sea true
      const modalElement = document.getElementById('formatoCSVModal');
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();

        // Limpiar cuando se cierre el modal
        const handleHidden = () => {
          onClose();
        };

        modalElement.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
          modalElement.removeEventListener('hidden.bs.modal', handleHidden);
          modal.hide();
        };
      }
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="modal fade" id="formatoCSVModal" tabindex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📊 Seleccionar Formato CSV</h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Estadísticas del Reporte:</strong>
              <ul className="mt-2 list-unstyled">
                <li>• Total de productos: {estadisticas.totalProductos}</li>
                <li>• Sin stock: {estadisticas.sinStock}</li>
                <li>• Stock crítico: {estadisticas.stockCritico}</li>
                <li>• Stock normal: {estadisticas.stockNormal}</li>
                <li>• Valor total: {estadisticas.valorTotalInventario}</li>
              </ul>
            </div>
            <div className="mb-3">
              <strong>Selecciona el formato:</strong>
            </div>
            <div className="d-grid gap-2">
              <button 
                type="button" 
                className="btn btn-outline-success btn-lg"
                onClick={() => onSeleccionarFormato('csv')}
                data-bs-dismiss="modal"
              >
                <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                CSV Estándar
                <br />
                <small className="text-muted">Para programas generales</small>
              </button>
              <button 
                type="button" 
                className="btn btn-outline-primary btn-lg"
                onClick={() => onSeleccionarFormato('csv-excel')}
                data-bs-dismiss="modal"
              >
                <i className="bi bi-microsoft me-2"></i>
                CSV para Excel
                <br />
                <small className="text-muted">Optimizado para Microsoft Excel</small>
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteModal;