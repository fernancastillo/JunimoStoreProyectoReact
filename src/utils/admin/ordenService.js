// utils/admin/ordenService.js
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
  }
};