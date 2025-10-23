export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CL');
};

export const getEstadoBadge = (estado) => {
  const badgeClasses = {
    'Entregado': 'bg-success',
    'Pendiente': 'bg-warning',
    'Enviado': 'bg-info',
    'Cancelado': 'bg-danger'
  };
  return badgeClasses[estado] || 'bg-secondary';
};

// ✅ Podemos agregar más utilidades específicas del admin aquí
export const calculateTasaEntrega = (entregadas, total) => {
  return total > 0 ? Math.round((entregadas / total) * 100) : 0;
};

export const getProductosPorCategoria = (productos) => {
  return productos.reduce((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});
};