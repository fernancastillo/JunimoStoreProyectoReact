// src/utils/admin/dashboardUtils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';

  try {
    // Crear objeto Date
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      // Intentar con formato de Oracle SQL Date si falla
      const oracleDate = new Date(dateString.split(' ')[0]);
      if (!isNaN(oracleDate.getTime())) {
        const year = oracleDate.getFullYear();
        const month = String(oracleDate.getMonth() + 1).padStart(2, '0');
        const day = String(oracleDate.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
      }
      return 'Fecha inválida';
    }

    // Usar componentes locales (no UTC) para consistencia
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
    
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error);
    return 'Error en fecha';
  }
};

export const getEstadoBadge = (estado) => {
  if (!estado) return 'bg-secondary';

  const estadoLower = estado.toLowerCase();
  const badgeClasses = {
    'entregado': 'bg-success',
    'pendiente': 'bg-warning',
    'enviado': 'bg-info',
    'cancelado': 'bg-danger',
    'procesando': 'bg-primary',
    'completado': 'bg-success',
    'activo': 'bg-success',
    'inactivo': 'bg-secondary'
  };
  return badgeClasses[estadoLower] || 'bg-secondary';
};

export const calculateTasaEntrega = (entregadas, total) => {
  return total > 0 ? Math.round((entregadas / total) * 100) : 0;
};

// Función auxiliar para validar datos desde Oracle
export const validateOracleData = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

// Función para formatear números con separadores de miles
export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-CL').format(number);
};

// Función para obtener el nombre del mes
export const getMonthName = (monthIndex) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex] || '';
};

// Función para formatear fecha y hora
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Fecha no disponible';

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
    
  } catch (error) {
    console.error('Error formateando fecha y hora:', dateString, error);
    return 'Error en fecha';
  }
};

// Función para calcular días entre dos fechas
export const calculateDaysBetween = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error('Error calculando días entre fechas:', error);
    return 0;
  }
};

// Función para obtener el color según el estado
export const getStatusColor = (estado) => {
  if (!estado) return '#6c757d';

  const estadoLower = estado.toLowerCase();
  const colors = {
    'entregado': '#198754',
    'pendiente': '#ffc107',
    'enviado': '#0dcaf0',
    'cancelado': '#dc3545',
    'procesando': '#0d6efd',
    'completado': '#198754',
    'activo': '#198754',
    'inactivo': '#6c757d'
  };
  return colors[estadoLower] || '#6c757d';
};

// Función para truncar texto largo
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Función para validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar RUN chileno
export const isValidRUN = (run) => {
  if (!run) return false;
  
  const runRegex = /^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])$/;
  if (!runRegex.test(run)) return false;

  // Validar dígito verificador
  const runClean = run.replace(/\./g, '').replace(/-/g, '');
  const body = runClean.slice(0, -1);
  const dv = runClean.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const calculatedDv = 11 - (sum % 11);
  let expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

  return dv === expectedDv;
};

// Función para formatear RUN
export const formatRUN = (run) => {
  if (!run) return '';
  
  // Si ya está formateado, retornar tal cual
  if (run.includes('.') && run.includes('-')) {
    return run;
  }

  // Limpiar y formatear
  const cleanRun = run.replace(/\./g, '').replace(/-/g, '');
  if (cleanRun.length < 8 || cleanRun.length > 9) return run;

  const body = cleanRun.slice(0, -1);
  const dv = cleanRun.slice(-1).toUpperCase();

  if (body.length === 8) {
    return `${body.slice(0, 2)}.${body.slice(2, 5)}.${body.slice(5)}-${dv}`;
  } else {
    return `${body.slice(0, 1)}.${body.slice(1, 4)}.${body.slice(4)}-${dv}`;
  }
};

// Función para capitalizar texto
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Función para formatear bytes a tamaño legible
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};