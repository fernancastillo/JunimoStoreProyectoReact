// src/utils/admin/useOrdenes.js - ARCHIVO NUEVO
import { useState, useEffect } from 'react';
import { ordenService } from './ordenService';
import { calcularEstadisticasOrdenes, aplicarFiltrosOrdenes } from './ordenStats';

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrden, setEditingOrden] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState({
    numeroOrden: '',
    run: '',
    estado: '',
    fecha: ''
  });

  // Cargar órdenes al inicializar
  useEffect(() => {
    loadOrdenes();
  }, []);

  // Aplicar filtros cuando cambien las órdenes o los filtros
  useEffect(() => {
    const filtered = aplicarFiltrosOrdenes(ordenes, filtros);
    setOrdenesFiltradas(filtered);
  }, [ordenes, filtros]);

  /**
   * Carga todas las órdenes desde el servicio
   */
  const loadOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ordenService.getOrdenes();
      setOrdenes(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      // Podrías agregar un estado de error aquí si lo necesitas
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre el modal para ver detalles de una orden
   */
  const handleEdit = (orden) => {
    setEditingOrden(orden);
    setShowModal(true);
  };

  /**
   * Actualiza el estado de envío de una orden
   */
  const handleUpdateEstado = async (numeroOrden, nuevoEstado) => {
    try {
      await ordenService.updateEstadoOrden(numeroOrden, nuevoEstado);
      await loadOrdenes(); // Recargar para obtener datos actualizados
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  /**
   * Cierra el modal de detalles
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrden(null);
  };

  /**
   * Maneja cambios en los filtros de búsqueda
   */
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Limpia todos los filtros aplicados
   */
  const handleLimpiarFiltros = () => {
    setFiltros({
      numeroOrden: '',
      run: '',
      estado: '',
      fecha: ''
    });
  };

  /**
   * Recarga los datos (útil para sincronizar después de cambios externos)
   */
  const refreshData = () => {
    loadOrdenes();
  };

  // Calcular estadísticas en tiempo real
  const estadisticas = calcularEstadisticasOrdenes(ordenes);

  return {
    // Estados
    ordenes,
    ordenesFiltradas,
    loading,
    editingOrden,
    showModal,
    filtros,
    estadisticas,
    
    // Acciones
    handleEdit,
    handleUpdateEstado,
    handleCloseModal,
    handleFiltroChange,
    handleLimpiarFiltros,
    refreshData,
    
    // Aliases para consistencia con useProductos
    onEdit: handleEdit,
    onUpdate: handleUpdateEstado,
    onCloseModal: handleCloseModal
  };
};