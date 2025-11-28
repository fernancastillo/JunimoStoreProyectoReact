// src/utils/admin/dashboardUtils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

// FUNCIÓN PRINCIPAL PARA MOSTRAR FECHAS EN LA INTERFAZ (DD/MM/YYYY)
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';

  try {
    // Crear objeto Date - usar UTC para consistencia
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    // Usar componentes UTC para consistencia total
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
    
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error);
    return 'Error en fecha';
  }
};

// FUNCIÓN PARA INPUT DATE (YYYY-MM-DD) - desde BD a formulario
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Usar componentes UTC para evitar problemas de zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formateando fecha para input:', error);
    return '';
  }
};

// FUNCIÓN PARA BACKEND - desde formulario a BD (VERSIÓN MEJORADA)
export const formatDateForBackend = (inputDate) => {
  if (!inputDate) return null;
  
  try {
    const fechaParts = inputDate.split('-');
    if (fechaParts.length !== 3) return null;
    
    const year = parseInt(fechaParts[0]);
    const month = parseInt(fechaParts[1]) - 1; // Mes es 0-indexed
    const day = parseInt(fechaParts[2]);
    
    // SOLUCIÓN DEFINITIVA: Usar fecha local y luego UTC
    const fechaLocal = new Date(year, month, day);
    
    // Obtener componentes UTC de la fecha local
    const utcYear = fechaLocal.getUTCFullYear();
    const utcMonth = fechaLocal.getUTCMonth();
    const utcDay = fechaLocal.getUTCDate();
    
    // Crear fecha UTC final
    const fechaUTC = new Date(Date.UTC(utcYear, utcMonth, utcDay));
    
    // Formatear como YYYY-MM-DD para Oracle
    const finalYear = fechaUTC.getUTCFullYear();
    const finalMonth = String(fechaUTC.getUTCMonth() + 1).padStart(2, '0');
    const finalDay = String(fechaUTC.getUTCDate()).padStart(2, '0');
    
    const fechaFinal = `${finalYear}-${finalMonth}-${finalDay}`;
    
    console.log('Proceso fecha backend:', {
      input: inputDate,
      local: fechaLocal.toISOString(),
      utc: fechaUTC.toISOString(),
      final: fechaFinal
    });
    
    return fechaFinal;
    
  } catch (error) {
    console.error('Error formateando fecha para backend:', error);
    return null;
  }
};

// FUNCIÓN ALTERNATIVA SIMPLE PARA BACKEND
export const formatDateForBackendSimple = (inputDate) => {
  if (!inputDate) return null;
  
  try {
    // SOLUCIÓN SIMPLE: Enviar la fecha directamente
    // Oracle maneja bien el formato YYYY-MM-DD sin conversiones
    const fechaParts = inputDate.split('-');
    if (fechaParts.length !== 3) return null;
    
    // Validar que sea una fecha válida
    const year = parseInt(fechaParts[0]);
    const month = parseInt(fechaParts[1]);
    const day = parseInt(fechaParts[2]);
    
    if (year < 1900 || year > 2100) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    
    // Devolver la fecha original sin cambios
    return inputDate;
    
  } catch (error) {
    console.error('Error formateando fecha para backend (simple):', error);
    return null;
  }
};

// FUNCIÓN PARA VALIDAR Y NORMALIZAR FECHA DESDE BD
export const normalizeDateFromDB = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Si ya es una fecha ISO, usarla directamente
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Si es solo fecha YYYY-MM-DD, crear en UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Intentar parsear como fecha local
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
    
  } catch (error) {
    console.error('Error normalizando fecha desde BD:', error);
    return null;
  }
};

// FUNCIÓN PARA DEBUG: Mostrar información completa de una fecha
export const debugDate = (dateString, label = 'Fecha') => {
  if (!dateString) {
    console.log(`${label}: null o undefined`);
    return;
  }
  
  try {
    const date = new Date(dateString);
    const dateLocal = new Date(dateString + 'T00:00:00'); // Forzar fecha local
    
    console.log(`${label}:`, {
      original: dateString,
      dateObject: date,
      iso: date.toISOString(),
      localISO: dateLocal.toISOString(),
      utc: {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate()
      },
      local: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      timezoneOffset: date.getTimezoneOffset(),
      isValid: !isNaN(date.getTime())
    });
  } catch (error) {
    console.error(`Error en debugDate para ${label}:`, error);
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
    const date = normalizeDateFromDB(dateString);
    if (!date) return 'Fecha inválida';

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
    
  } catch (error) {
    console.error('Error formateando fecha y hora:', dateString, error);
    return 'Error en fecha';
  }
};

// Función para calcular días entre dos fechas
export const calculateDaysBetween = (startDate, endDate) => {
  try {
    const start = normalizeDateFromDB(startDate);
    const end = normalizeDateFromDB(endDate);
    
    if (!start || !end) {
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

// FUNCIONES ESPECÍFICAS PARA EL PROBLEMA DE FECHAS

/**
 * Convierte una fecha del formulario (YYYY-MM-DD) a formato para Oracle
 * Mantiene exactamente el mismo día sin cambios por zona horaria
 */
export const convertFormDateToOracle = (formDate) => {
  if (!formDate) return null;
  
  try {
    // Para Oracle, simplemente usar la fecha tal cual del formulario
    // Oracle DATE no tiene información de zona horaria
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(formDate)) {
      console.error('Formato de fecha inválido para Oracle:', formDate);
      return null;
    }
    
    // Validar componentes de fecha
    const [year, month, day] = formDate.split('-').map(Number);
    
    if (year < 1900 || year > 2100) {
      console.error('Año fuera de rango:', year);
      return null;
    }
    
    if (month < 1 || month > 12) {
      console.error('Mes fuera de rango:', month);
      return null;
    }
    
    // Validar día según el mes
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      console.error('Día fuera de rango:', day, 'para mes', month);
      return null;
    }
    
    console.log('Fecha para Oracle (sin cambios):', formDate);
    return formDate;
    
  } catch (error) {
    console.error('Error convirtiendo fecha para Oracle:', error);
    return null;
  }
};

/**
 * Convierte una fecha de Oracle al formato del formulario (YYYY-MM-DD)
 */
export const convertOracleDateToForm = (oracleDate) => {
  if (!oracleDate) return '';
  
  try {
    // Si es un string de fecha YYYY-MM-DD, usarlo directamente
    if (typeof oracleDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(oracleDate)) {
      return oracleDate;
    }
    
    // Si es un objeto Date o string ISO, convertirlo
    const date = new Date(oracleDate);
    if (isNaN(date.getTime())) {
      console.error('Fecha de Oracle inválida:', oracleDate);
      return '';
    }
    
    // Usar componentes locales para mantener el día correcto
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formDate = `${year}-${month}-${day}`;
    console.log('Fecha de Oracle convertida a formulario:', { oracleDate, formDate });
    
    return formDate;
    
  } catch (error) {
    console.error('Error convirtiendo fecha de Oracle a formulario:', error);
    return '';
  }
};