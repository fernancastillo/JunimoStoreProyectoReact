// src/utils/admin/ordenService.js - AGREGAR función delete
import ordenesData from '../../data/ordenes.json';

const STORAGE_KEY = 'admin_ordenes';

export const ordenService = {
  async getOrdenes() {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Obtener de localStorage o retornar datos del JSON
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Usar datos del JSON existente
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenesData));
    return ordenesData;
  },

  async updateEstadoOrden(numeroOrden, nuevoEstado) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ordenes = await this.getOrdenes();
    const ordenIndex = ordenes.findIndex(o => o.numeroOrden === numeroOrden);
    
    if (ordenIndex === -1) {
      throw new Error('Orden no encontrada');
    }
    
    ordenes[ordenIndex].estadoEnvio = nuevoEstado;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
    
    return ordenes[ordenIndex];
  },

  async getOrdenByNumero(numeroOrden) {
    const ordenes = await this.getOrdenes();
    return ordenes.find(o => o.numeroOrden === numeroOrden);
  },

  // ✅ NUEVA FUNCIÓN: Eliminar orden
  async deleteOrden(numeroOrden) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ordenes = await this.getOrdenes();
    const ordenIndex = ordenes.findIndex(o => o.numeroOrden === numeroOrden);
    
    if (ordenIndex === -1) {
      throw new Error('Orden no encontrada');
    }
    
    // Verificar que no sea una orden entregada (opcional - por seguridad)
    const orden = ordenes[ordenIndex];
    if (orden.estadoEnvio === 'Entregado') {
      throw new Error('No se puede eliminar una orden ya entregada');
    }
    
    // Eliminar la orden
    ordenes.splice(ordenIndex, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
    
    return true;
  }
};