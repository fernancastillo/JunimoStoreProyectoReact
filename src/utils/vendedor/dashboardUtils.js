// src/utils/vendedor/dashboardUtils.js
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0';
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(amount);
};

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

// FUNCIÓN PARA CONVERTIR FECHA DE ORACLE AL FORMULARIO
export const convertOracleDateToForm = (oracleDate) => {
    if (!oracleDate) return '';
    
    try {
        // Si ya es una fecha YYYY-MM-DD, usarla directamente
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
        console.log('VENDEDOR - Fecha de Oracle convertida a formulario:', { oracleDate, formDate });
        
        return formDate;
        
    } catch (error) {
        console.error('Error convirtiendo fecha de Oracle a formulario:', error);
        return '';
    }
};

export const getEstadoBadge = (estado) => {
    if (!estado) return 'bg-secondary';

    const estadoLower = estado.toLowerCase();
    const badgeClasses = {
        'entregado': 'entregado-custom text-dark',
        'pendiente': 'pendiente-custom text-dark',
        'enviado': 'enviado-custom text-dark',
        'cancelado': 'cancelado-custom text-dark',
        'procesando': 'bg-primary text-white'
    };
    return badgeClasses[estadoLower] || 'bg-secondary text-dark';
};

// Función auxiliar para validar datos desde Oracle
export const validateOracleData = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
};