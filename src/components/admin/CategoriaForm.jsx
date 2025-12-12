import { useState, useEffect } from 'react';

const CategoriaForm = ({ categoria, nombreCategoriaExiste, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || ''
      });
    } else {
      setFormData({
        nombre: ''
      });
    }
    // Limpiar errores al cambiar la categoría
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar en tiempo real
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'nombre') {
      const nombreLimpio = value.trim();
      
      if (!nombreLimpio) {
        error = 'El nombre de la categoría es requerido';
      } else if (nombreLimpio.length < 2) {
        error = 'El nombre debe tener al menos 2 caracteres';
      } else if (nombreLimpio.length > 100) {
        error = 'El nombre no puede exceder los 100 caracteres';
      } else if (nombreCategoriaExiste && nombreCategoriaExiste(nombreLimpio, categoria?.id || null)) {
        error = `Ya existe ${categoria ? 'otra ' : ''}categoría con este nombre`;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nombreLimpio = formData.nombre.trim();
    
    if (!nombreLimpio) {
      newErrors.nombre = 'El nombre de la categoría es requerido';
    } else if (nombreLimpio.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombreLimpio.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder los 100 caracteres';
    } else if (nombreCategoriaExiste && nombreCategoriaExiste(nombreLimpio, categoria?.id || null)) {
      newErrors.nombre = `Ya existe ${categoria ? 'otra ' : ''}categoría con este nombre`;
    }

    // Marcar todos los campos como tocados para mostrar errores
    setTouched({
      nombre: true
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Evitar doble envío
    
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const categoriaData = {
        nombre: formData.nombre.trim()
      };

      await onSubmit(categoriaData);
    } catch (error) {
      console.error('Error en submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  // Función para sugerir nombres alternativos si hay duplicado
  const sugerirNombresAlternativos = () => {
    const nombreBase = formData.nombre.trim();
    if (!nombreBase || !nombreCategoriaExiste(nombreBase, categoria?.id || null)) {
      return [];
    }

    const sugerencias = [];
    
    // Sugerencia 1: Añadir "Nuevo"
    sugerencias.push(`${nombreBase} Nuevo`);
    
    // Sugerencia 2: Añadir "Premium"
    sugerencias.push(`${nombreBase} Premium`);
    
    // Sugerencia 3: Añadir "2024"
    const añoActual = new Date().getFullYear();
    sugerencias.push(`${nombreBase} ${añoActual}`);
    
    // Sugerencia 4: Añadir "Plus"
    sugerencias.push(`${nombreBase} Plus`);
    
    return sugerencias;
  };

  const sugerencias = sugerirNombresAlternativos();
  const hayDuplicado = touched.nombre && nombreCategoriaExiste && nombreCategoriaExiste(formData.nombre.trim(), categoria?.id || null);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre de la Categoría *
        </label>
        <input
          type="text"
          className={`form-control ${touched.nombre && errors.nombre ? 'is-invalid' : ''} ${touched.nombre && !errors.nombre ? 'is-valid' : ''}`}
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ej: Electrónicos, Ropa, Juguetes..."
          autoFocus
          disabled={isSubmitting}
        />
        {touched.nombre && errors.nombre && (
          <div className="invalid-feedback">{errors.nombre}</div>
        )}
        {touched.nombre && !errors.nombre && !hayDuplicado && (
          <div className="valid-feedback">Nombre válido ✓</div>
        )}
        <div className="form-text">
          {categoria 
            ? 'Modifica el nombre de la categoría existente' 
            : 'Ingresa el nombre para la nueva categoría. Debe ser único en el sistema.'}
        </div>
      </div>

      {categoria && (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Estás editando la categoría con ID: <strong>#{categoria.id}</strong>
          <div className="small mt-1">
            Nombre actual: <span className="badge bg-secondary">{categoria.nombre}</span>
          </div>
        </div>
      )}

      {/* Mostrar mensaje de duplicado y sugerencias */}
      {hayDuplicado && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>¡Atención!</strong> {categoria ? 'Ya existe otra' : 'Ya existe una'} categoría con este nombre.
        </div>
      )}

      {/* Resumen de validación */}
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="card-title">
            <i className="bi bi-clipboard-check me-2"></i>
            Validaciones
          </h6>
          <ul className="list-unstyled mb-0">
            <li>
              {formData.nombre.trim().length >= 2 ? '✅' : '⭕'} 
              <span className="ms-2">Al menos 2 caracteres</span>
            </li>
            <li>
              {formData.nombre.trim().length <= 100 ? '✅' : '⭕'} 
              <span className="ms-2">Máximo 100 caracteres</span>
            </li>
            <li>
              {!hayDuplicado ? '✅' : '❌'} 
              <span className="ms-2">Nombre único</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!!errors.nombre || !formData.nombre.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {categoria ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            <>
              <i className={`bi ${categoria ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
              {categoria ? 'Actualizar Categoría' : 'Crear Categoría'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;