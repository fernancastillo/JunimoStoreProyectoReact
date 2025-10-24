import { useState, useEffect } from 'react';
import { dataService } from '../dataService';

// Categorías predefinidas + categorías personalizadas desde localStorage
const getCategorias = () => {
  const categoriasGuardadas = localStorage.getItem('admin_categorias');
  const categoriasBase = [
    'Accesorios',
    'Decoración',
    'Guías',
    'Juego De Mesa',
    'Mods Digitales',
    'Peluches',
    'Polera Personalizada'
  ];
  
  if (categoriasGuardadas) {
    const categoriasPersonalizadas = JSON.parse(categoriasGuardadas);
    return [...new Set([...categoriasBase, ...categoriasPersonalizadas])];
  }
  
  return categoriasBase;
};

// Guardar nueva categoría
const guardarCategoria = (nuevaCategoria) => {
  const categoriasGuardadas = localStorage.getItem('admin_categorias');
  let categoriasPersonalizadas = [];
  
  if (categoriasGuardadas) {
    categoriasPersonalizadas = JSON.parse(categoriasGuardadas);
  }
  
  if (!categoriasPersonalizadas.includes(nuevaCategoria)) {
    categoriasPersonalizadas.push(nuevaCategoria);
    localStorage.setItem('admin_categorias', JSON.stringify(categoriasPersonalizadas));
    return true;
  }
  
  return false;
};

// Función para verificar si un código ya existe
const codigoExiste = (codigo, productos) => {
  return productos.some(producto => producto.codigo === codigo);
};

// Función para generar prefijo único para categorías nuevas
const generarPrefijoUnico = (categoria, productos) => {
  let prefijoBase = categoria.substring(0, 2).toUpperCase();
  let prefijo = prefijoBase;
  let contador = 0;
  
  // Verificar si el prefijo base ya existe en algún producto
  const prefijoExiste = productos.some(producto => 
    producto.codigo.startsWith(prefijoBase)
  );
  
  if (!prefijoExiste) {
    return prefijoBase; // El prefijo base está disponible
  }
  
  // Si el prefijo base existe, buscar variaciones
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Primero intentar con la primera y tercera letra
  if (categoria.length >= 3) {
    prefijo = (categoria.substring(0, 1) + categoria.substring(2, 3)).toUpperCase();
    const prefijoAlternativoExiste = productos.some(producto => 
      producto.codigo.startsWith(prefijo)
    );
    if (!prefijoAlternativoExiste) {
      return prefijo;
    }
  }
  
  // Si no funciona, probar combinaciones con letras adicionales
  for (let i = 0; i < letras.length; i++) {
    for (let j = 0; j < letras.length; j++) {
      const prefijoTest = prefijoBase[0] + letras[j];
      const prefijoTestExiste = productos.some(producto => 
        producto.codigo.startsWith(prefijoTest)
      );
      if (!prefijoTestExiste) {
        return prefijoTest;
      }
    }
    
    // Si no encontramos con la primera letra, probar con segunda
    const prefijoTest2 = prefijoBase[1] + letras[i];
    const prefijoTest2Existe = productos.some(producto => 
      producto.codigo.startsWith(prefijoTest2)
    );
    if (!prefijoTest2Existe) {
      return prefijoTest2;
    }
  }
  
  // Como último recurso, usar prefijo base con número
  return prefijoBase + 'X';
};

// Generar código automático basado en categoría
const generarCodigo = (categoria, productos) => {
  const prefijos = {
    'Accesorios': 'AC',
    'Decoración': 'DE',
    'Guías': 'GU',
    'Juego De Mesa': 'JM',
    'Mods Digitales': 'MD',
    'Peluches': 'PE',
    'Polera Personalizada': 'PP'
  };
  
  let prefijo;
  
  if (prefijos[categoria]) {
    // Categoría predefinida - usar prefijo asignado
    prefijo = prefijos[categoria];
  } else {
    // Categoría nueva - generar prefijo único
    prefijo = generarPrefijoUnico(categoria, productos);
  }
  
  // Filtrar productos que empiecen con el mismo prefijo
  const productosCategoria = productos.filter(p => p.codigo.startsWith(prefijo));
  
  if (productosCategoria.length === 0) {
    // Si no hay productos con este prefijo, empezar en 001
    const codigoPropuesto = `${prefijo}001`;
    
    // Verificar que el código no exista (por si acaso)
    if (!codigoExiste(codigoPropuesto, productos)) {
      return codigoPropuesto;
    }
  }
  
  // Encontrar el número más alto existente para este prefijo
  let ultimoNumero = 0;
  productosCategoria.forEach(p => {
    const numeroStr = p.codigo.replace(prefijo, '');
    const numero = parseInt(numeroStr);
    if (!isNaN(numero) && numero > ultimoNumero) {
      ultimoNumero = numero;
    }
  });
  
  let nuevoNumero = ultimoNumero + 1;
  let codigoPropuesto = `${prefijo}${nuevoNumero.toString().padStart(3, '0')}`;
  
  // Verificar que el código generado no exista
  let intentos = 0;
  while (codigoExiste(codigoPropuesto, productos) && intentos < 100) {
    nuevoNumero++;
    codigoPropuesto = `${prefijo}${nuevoNumero.toString().padStart(3, '0')}`;
    intentos++;
  }
  
  // Si después de 100 intentos sigue existiendo, usar timestamp
  if (codigoExiste(codigoPropuesto, productos)) {
    const timestamp = Date.now().toString().slice(-6);
    codigoPropuesto = `${prefijo}${timestamp}`;
  }
  
  return codigoPropuesto;
};

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(getCategorias());
  const [loading, setLoading] = useState(true);
  const [editingProducto, setEditingProducto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = () => {
    const productosData = dataService.getProductos();
    setProductos(productosData);
    setCategorias(getCategorias());
    setLoading(false);
  };

  const handleCreate = (productoData) => {
    try {
      // Si es una nueva categoría, guardarla
      if (productoData.esNuevaCategoria && productoData.nuevaCategoria) {
        guardarCategoria(productoData.nuevaCategoria);
        productoData.categoria = productoData.nuevaCategoria;
      }
      
      // Generar código automáticamente siempre
      productoData.codigo = generarCodigo(productoData.categoria, productos);
      
      // Verificación final de que el código no existe
      if (codigoExiste(productoData.codigo, productos)) {
        // Si por alguna razón el código ya existe, generar uno con timestamp
        const timestamp = Date.now().toString().slice(-6);
        productoData.codigo = `${productoData.codigo.substring(0, 2)}${timestamp}`;
      }
      
      dataService.addProducto(productoData);
      loadProductos();
      setShowModal(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleUpdate = (codigo, productoData) => {
    try {
      // Si es una nueva categoría, guardarla
      if (productoData.esNuevaCategoria && productoData.nuevaCategoria) {
        guardarCategoria(productoData.nuevaCategoria);
        productoData.categoria = productoData.nuevaCategoria;
      }
      
      dataService.updateProducto(codigo, productoData);
      loadProductos();
      setShowModal(false);
      setEditingProducto(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleDelete = (codigo) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      dataService.deleteProducto(codigo);
      loadProductos();
    }
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditingProducto(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProducto(null);
  };

  const getCodigoAutomatico = (categoria) => {
    return generarCodigo(categoria, productos);
  };

  const actualizarCategorias = () => {
    setCategorias(getCategorias());
  };

  return {
    productos,
    categorias,
    loading,
    editingProducto,
    showModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCreateNew,
    handleCloseModal,
    getCodigoAutomatico,
    actualizarCategorias,
    refreshData: loadProductos
  };
};