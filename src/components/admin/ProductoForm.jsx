import { useState, useEffect } from 'react';

const ProductoForm = ({ producto, categorias, categoriaExiste, getCodigoAutomatico, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: categorias.length > 0 ? categorias[0] : '', // Usar primera categoría por defecto
    precio: '',
    stock: '',
    stock_critico: '',
    imagen: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagenPrevia, setImagenPrevia] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Imagen por defecto
  const imagenPorDefecto = '/src/assets/admin/productodefault.png';

  useEffect(() => {
    if (producto) {
      // Modo edición
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria || (categorias.length > 0 ? categorias[0] : ''),
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        stock_critico: producto.stock_critico.toString(),
        imagen: producto.imagen || ''
      });
      setCodigoGenerado(producto.codigo);
      setImagenPrevia(producto.imagen || imagenPorDefecto);
    } else {
      // Modo creación
      const categoriaDefault = categorias.length > 0 ? categorias[0] : '';
      const codigoAuto = getCodigoAutomatico(categoriaDefault);
      setFormData(prev => ({
        ...prev,
        categoria: categoriaDefault
      }));
      setCodigoGenerado(codigoAuto);
      setImagenPrevia(imagenPorDefecto);
    }
    
    // Limpiar estados
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [producto, getCodigoAutomatico, categorias]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia la categoría y no estamos editando, generar nuevo código
    if (name === 'categoria' && !producto) {
      const nuevoCodigo = getCodigoAutomatico(value);
      setCodigoGenerado(nuevoCodigo);
    }

    // Si cambia la imagen, actualizar previsualización
    if (name === 'imagen') {
      setImagenPrevia(value || imagenPorDefecto);
    }

    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar campo
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'nombre') {
      if (!value.trim()) {
        error = 'El nombre es requerido';
      } else if (value.trim().length < 2) {
        error = 'El nombre debe tener al menos 2 caracteres';
      }
    } else if (name === 'descripcion') {
      if (!value.trim()) {
        error = 'La descripción es requerida';
      }
    } else if (name === 'categoria') {
      if (!value) {
        error = 'La categoría es requerida';
      } else if (categorias.length === 0) {
        error = 'No hay categorías disponibles. Por favor, crea categorías primero.';
      }
    } else if (name === 'precio') {
      const precioNum = parseFloat(value);
      if (!value || isNaN(precioNum) || precioNum <= 0) {
        error = 'El precio debe ser mayor a 0';
      }
    } else if (name === 'stock') {
      const stockNum = parseInt(value);
      if (!value || isNaN(stockNum) || stockNum < 0) {
        error = 'El stock no puede ser negativo';
      }
    } else if (name === 'stock_critico') {
      const stockCriticoNum = parseInt(value);
      if (!value || isNaN(stockCriticoNum) || stockCriticoNum < 0) {
        error = 'El stock crítico no puede ser negativo';
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    // Validar categoría
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    } else if (categorias.length === 0) {
      newErrors.categoria = 'No hay categorías disponibles. Por favor, crea categorías primero.';
    }

    // Validar precio
    const precioNum = parseFloat(formData.precio);
    if (!formData.precio || isNaN(precioNum) || precioNum <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    // Validar stock
    const stockNum = parseInt(formData.stock);
    if (!formData.stock || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    // Validar stock crítico
    const stockCriticoNum = parseInt(formData.stock_critico);
    if (!formData.stock_critico || isNaN(stockCriticoNum) || stockCriticoNum < 0) {
      newErrors.stock_critico = 'El stock crítico no puede ser negativo';
    }

    // Marcar todos los campos como tocados
    const allTouched = {
      nombre: true,
      descripcion: true,
      categoria: true,
      precio: true,
      stock: true,
      stock_critico: true
    };
    setTouched(allTouched);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagenUrl = URL.createObjectURL(file);
      setImagenPrevia(imagenUrl);
      setFormData(prev => ({
        ...prev,
        imagen: imagenUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Preparar datos
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        stock_critico: parseInt(formData.stock_critico),
        imagen: formData.imagen || imagenPorDefecto,
        codigo: codigoGenerado
      };

      await onSubmit(productoData);
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

  // Mostrar mensaje si no hay categorías
  if (categorias.length === 0) {
    return (
      <div className="alert alert-warning">
        <h5 className="alert-heading">No hay categorías disponibles</h5>
        <p>Debes crear categorías primero antes de poder agregar productos.</p>
        <div className="d-flex justify-content-end">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Mostrar código generado */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Código del Producto
            </label>
            <div className="form-control bg-light">
              <strong>{codigoGenerado}</strong>
            </div>
            <div className="form-text">
              El código se genera automáticamente según la categoría seleccionada.
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">
              Categoría *
            </label>
            <select
              className={`form-select ${touched.categoria && errors.categoria ? 'is-invalid' : ''}`}
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {touched.categoria && errors.categoria && (
              <div className="invalid-feedback">{errors.categoria}</div>
            )}
            <div className="form-text">
              Las categorías deben crearse primero en la sección de Categorías.
            </div>
          </div>
        </div>
      </div>

      {/* Resto del formulario... */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del Producto *
        </label>
        <input
          type="text"
          className={`form-control ${touched.nombre && errors.nombre ? 'is-invalid' : ''} ${touched.nombre && !errors.nombre ? 'is-valid' : ''}`}
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ej: Llavero Stardew Valley"
          disabled={isSubmitting}
        />
        {touched.nombre && errors.nombre && (
          <div className="invalid-feedback">{errors.nombre}</div>
        )}
        {touched.nombre && !errors.nombre && (
          <div className="valid-feedback">Nombre válido ✓</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción *
        </label>
        <textarea
          className={`form-control ${touched.descripcion && errors.descripcion ? 'is-invalid' : ''} ${touched.descripcion && !errors.descripcion ? 'is-valid' : ''}`}
          id="descripcion"
          name="descripcion"
          rows="3"
          value={formData.descripcion}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Descripción detallada del producto..."
          disabled={isSubmitting}
        />
        {touched.descripcion && errors.descripcion && (
          <div className="invalid-feedback">{errors.descripcion}</div>
        )}
        {touched.descripcion && !errors.descripcion && (
          <div className="valid-feedback">Descripción válida ✓</div>
        )}
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">
              Precio (CLP) *
            </label>
            <input
              type="number"
              className={`form-control ${touched.precio && errors.precio ? 'is-invalid' : ''} ${touched.precio && !errors.precio ? 'is-valid' : ''}`}
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              placeholder="5990"
              disabled={isSubmitting}
            />
            {touched.precio && errors.precio && (
              <div className="invalid-feedback">{errors.precio}</div>
            )}
            {touched.precio && !errors.precio && (
              <div className="valid-feedback">Precio válido ✓</div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="stock" className="form-label">
              Stock Actual *
            </label>
            <input
              type="number"
              className={`form-control ${touched.stock && errors.stock ? 'is-invalid' : ''} ${touched.stock && !errors.stock ? 'is-valid' : ''}`}
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              placeholder="50"
              disabled={isSubmitting}
            />
            {touched.stock && errors.stock && (
              <div className="invalid-feedback">{errors.stock}</div>
            )}
            {touched.stock && !errors.stock && (
              <div className="valid-feedback">Stock válido ✓</div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="stock_critico" className="form-label">
              Stock Crítico *
            </label>
            <input
              type="number"
              className={`form-control ${touched.stock_critico && errors.stock_critico ? 'is-invalid' : ''} ${touched.stock_critico && !errors.stock_critico ? 'is-valid' : ''}`}
              id="stock_critico"
              name="stock_critico"
              value={formData.stock_critico}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              placeholder="10"
              disabled={isSubmitting}
            />
            {touched.stock_critico && errors.stock_critico && (
              <div className="invalid-feedback">{errors.stock_critico}</div>
            )}
            {touched.stock_critico && !errors.stock_critico && (
              <div className="valid-feedback">Stock crítico válido ✓</div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de imagen */}
      <div className="mb-3">
        <label htmlFor="imagen" className="form-label">
          Imagen del Producto
        </label>

        {/* Previsualización de imagen */}
        {imagenPrevia && (
          <div className="mb-2">
            <img
              src={imagenPrevia}
              alt="Previsualización"
              className="img-thumbnail"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = imagenPorDefecto;
              }}
            />
          </div>
        )}

        <div className="input-group">
          <input
            type="file"
            className="form-control"
            id="imagenFile"
            accept="image/*"
            onChange={handleImagenChange}
            disabled={isSubmitting}
          />
          <span className="input-group-text">o</span>
          <input
            type="text"
            className="form-control"
            id="imagenUrl"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="URL de la imagen o sube un archivo"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-text">
          Puedes subir una imagen o ingresar una URL. Si no seleccionas ninguna, se usará la imagen por defecto.
        </div>
      </div>

      {/* Resumen de validación */}
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="card-title">
            <i className="bi bi-clipboard-check me-2"></i>
            Validaciones
          </h6>
          <ul className="list-unstyled mb-0">
            <li>
              {!errors.nombre ? '✅' : '❌'} 
              <span className="ms-2">Nombre válido</span>
            </li>
            <li>
              {!errors.descripcion ? '✅' : '❌'} 
              <span className="ms-2">Descripción válida</span>
            </li>
            <li>
              {!errors.categoria ? '✅' : '❌'} 
              <span className="ms-2">Categoría válida</span>
            </li>
            <li>
              {!errors.precio ? '✅' : '❌'} 
              <span className="ms-2">Precio válido</span>
            </li>
            <li>
              {!errors.stock ? '✅' : '❌'} 
              <span className="ms-2">Stock válido</span>
            </li>
            <li>
              {!errors.stock_critico ? '✅' : '❌'} 
              <span className="ms-2">Stock crítico válido</span>
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
          disabled={Object.keys(errors).some(key => errors[key]) || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {producto ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            <>
              <i className={`bi ${producto ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
              {producto ? 'Actualizar Producto' : 'Crear Producto'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;