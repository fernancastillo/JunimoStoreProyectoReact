import { useState, useEffect } from 'react';
import { dataService } from '../dataService';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [filtros, setFiltros] = useState({
    id: '',
    nombre: '',
    ordenarPor: 'id'
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [categorias, filtros]);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dataService.getCategorias();
      const categoriasData = Array.isArray(response) ? response : [];

      setCategorias(categoriasData);
      setCategoriasFiltradas(categoriasData);

    } catch (error) {
      setError(`Error al cargar categorías: ${error.message}`);
      setCategorias([]);
      setCategoriasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN PARA VERIFICAR SI EL NOMBRE YA EXISTE (CASE INSENSITIVE)
  const nombreCategoriaExiste = (nombre, excluirId = null) => {
    if (!nombre || !categorias.length) return false;
    
    const nombreNormalizado = nombre.trim().toLowerCase();
    
    return categorias.some(categoria => {
      // Si estamos excluyendo una categoría (en edición), saltamos esa
      if (excluirId !== null && categoria.id === excluirId) {
        return false;
      }
      
      return categoria.nombre.trim().toLowerCase() === nombreNormalizado;
    });
  };

  // FUNCIÓN PARA OBTENER NOMBRES DE CATEGORÍAS EXISTENTES
  const obtenerNombresCategoriasExistentes = (excluirId = null) => {
    return categorias
      .filter(cat => excluirId === null || cat.id !== excluirId)
      .map(cat => cat.nombre.toLowerCase().trim());
  };

  const aplicarFiltros = () => {
    if (!Array.isArray(categorias)) {
      setCategoriasFiltradas([]);
      return;
    }

    let categoriasFiltradas = [...categorias];

    // Filtro por ID
    if (filtros.id) {
      categoriasFiltradas = categoriasFiltradas.filter(cat =>
        cat.id && cat.id.toString().includes(filtros.id)
      );
    }

    // Filtro por nombre
    if (filtros.nombre) {
      categoriasFiltradas = categoriasFiltradas.filter(cat =>
        cat.nombre && cat.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    }

    // Ordenar
    categoriasFiltradas = ordenarCategorias(categoriasFiltradas, filtros.ordenarPor);

    setCategoriasFiltradas(categoriasFiltradas);
  };

  const ordenarCategorias = (categorias, criterio) => {
    if (!Array.isArray(categorias)) return [];

    const categoriasOrdenadas = [...categorias];

    switch (criterio) {
      case 'id':
        return categoriasOrdenadas.sort((a, b) => a.id - b.id);
      case 'id-desc':
        return categoriasOrdenadas.sort((a, b) => b.id - a.id);
      case 'nombre':
        return categoriasOrdenadas.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'nombre-desc':
        return categoriasOrdenadas.sort((a, b) => b.nombre.localeCompare(a.nombre));
      default:
        return categoriasOrdenadas;
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      id: '',
      nombre: '',
      ordenarPor: 'id'
    });
  };

  const clearSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage('');
  };

  const handleCreate = async (categoriaData) => {
    try {
      // VALIDACIÓN EN FRONTEND: Verificar si el nombre ya existe
      if (nombreCategoriaExiste(categoriaData.nombre)) {
        return { 
          success: false, 
          error: `Ya existe una categoría con el nombre "${categoriaData.nombre}"` 
        };
      }

      const categoriaParaBackend = {
        nombre: categoriaData.nombre.trim()
      };

      await dataService.addCategoria(categoriaParaBackend);
      
      await loadCategorias();
      setShowModal(false);

      setSuccessMessage('Categoría agregada con éxito');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      return { success: true };
    } catch (error) {
      return { success: false, error: `Error al crear categoría: ${error.message}` };
    }
  };

  const handleUpdate = async (categoriaData) => {
    try {
      // VALIDACIÓN EN FRONTEND: Verificar si el nombre ya existe (excluyendo esta categoría)
      if (nombreCategoriaExiste(categoriaData.nombre, categoriaData.id)) {
        return { 
          success: false, 
          error: `Ya existe otra categoría con el nombre "${categoriaData.nombre}"` 
        };
      }

      const categoriaParaBackend = {
        id: categoriaData.id,
        nombre: categoriaData.nombre.trim()
      };

      await dataService.updateCategoria(categoriaParaBackend);

      await loadCategorias();
      setShowModal(false);
      setEditingCategoria(null);

      setSuccessMessage('Categoría actualizada con éxito');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      return { success: true };
    } catch (error) {
      return { success: false, error: `Error al actualizar categoría: ${error.message}` };
    }
  };

  const handleDelete = async (id) => {
    try {
      await dataService.deleteCategoria(id);
      await loadCategorias();
      
      setSuccessMessage('Categoría eliminada con éxito');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditingCategoria(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
  };

  const handleSave = async (categoriaData) => {
    try {
      let result;

      if (editingCategoria) {
        categoriaData.id = editingCategoria.id;
        result = await handleUpdate(categoriaData);
      } else {
        result = await handleCreate(categoriaData);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    categorias,
    categoriasFiltradas,
    loading,
    error,
    editingCategoria,
    showModal,
    filtros,
    successMessage,
    showSuccessMessage,
    clearSuccessMessage,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCreateNew,
    handleCloseModal,
    handleSave,
    loadCategorias,
    refreshData: loadCategorias,
    handleFiltroChange,
    handleLimpiarFiltros,
    nombreCategoriaExiste,
    obtenerNombresCategoriasExistentes
  };
};