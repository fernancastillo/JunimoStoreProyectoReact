// src/components/admin/UsuarioModal.jsx
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/admin/dashboardUtils';

const UsuarioModal = ({ show, usuario, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: ''
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        comuna: usuario.comuna || '',
        region: usuario.region || ''
      });
    }
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(usuario.run, formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!show || !usuario) return null;

  const getTipoBadgeClass = (tipo) => {
    return tipo === 'Admin' ? 'bg-danger text-white' : 'bg-info text-white';
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person me-2"></i>
              Detalles de Usuario: <span className="text-primary">{usuario.nombre} {usuario.apellidos}</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0 fw-bold">
                      <i className="bi bi-info-circle me-2"></i>
                      Información Personal
                    </h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">RUN</label>
                        <input 
                          type="text" 
                          className="form-control bg-light" 
                          value={usuario.run} 
                          readOnly 
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Nombre *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Apellidos *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="apellidos"
                              value={formData.apellidos}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email *</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Teléfono</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Dirección</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Comuna</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="comuna"
                              value={formData.comuna}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Región</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="region"
                              value={formData.region}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          <i className="bi bi-check-circle me-2"></i>
                          Guardar Cambios
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0 fw-bold">
                      <i className="bi bi-graph-up me-2"></i>
                      Información de Cuenta
                    </h6>
                  </div>
                  <div className="card-body">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="fw-bold text-muted">Tipo:</td>
                          <td>
                            <span className={`badge ${getTipoBadgeClass(usuario.tipo)}`}>
                              {usuario.tipo}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Fecha Nacimiento:</td>
                          <td>{formatDate(usuario.fecha_nacimiento)}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Total Compras:</td>
                          <td>
                            <span className="badge bg-primary">
                              {usuario.totalCompras}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Total Gastado:</td>
                          <td className="fw-bold text-success">
                            {formatCurrency(usuario.totalGastado)}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Promedio por Compra:</td>
                          <td>
                            {usuario.totalCompras > 0 
                              ? formatCurrency(usuario.totalGastado / usuario.totalCompras)
                              : formatCurrency(0)
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Información adicional */}
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="fw-bold mb-2">Resumen de Actividad</h6>
                      <small className="text-muted">
                        {usuario.totalCompras === 0 
                          ? 'Este usuario aún no ha realizado compras.'
                          : `Ha realizado ${usuario.totalCompras} compra(s) con un total de ${formatCurrency(usuario.totalGastado)}.`
                        }
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="bi bi-x-circle me-2"></i>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioModal;