import { useState, useEffect } from 'react';
import { authService } from '../tienda/authService';
import { dataService } from '../dataService';

export const usePerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const usuarioActual = authService.getCurrentUser();

      if (usuarioActual) {
        const usuarioCompleto = await dataService.getUsuarioById(usuarioActual.id);

        if (usuarioCompleto) {
          setUsuario(usuarioCompleto);
          
          // SIMPLIFICACIÓN: Usar la fecha directamente sin ajustes
          const fechaBD = usuarioCompleto.fechaNac || usuarioCompleto.fecha_nacimiento;
          let fechaParaFormulario = '';
          
          if (fechaBD) {
            const fecha = new Date(fechaBD);
            if (!isNaN(fecha.getTime())) {
              // Usar la fecha local directamente
              const year = fecha.getFullYear();
              const month = String(fecha.getMonth() + 1).padStart(2, '0');
              const day = String(fecha.getDate()).padStart(2, '0');
              fechaParaFormulario = `${year}-${month}-${day}`;
            }
          }

          setFormData({
            nombre: usuarioCompleto.nombre || '',
            apellidos: usuarioCompleto.apellidos || '',
            correo: usuarioCompleto.correo || '',
            telefono: usuarioCompleto.telefono ? usuarioCompleto.telefono.toString() : '',
            direccion: usuarioCompleto.direccion || '',
            comuna: usuarioCompleto.comuna || '',
            region: usuarioCompleto.region || '',
            fecha_nacimiento: fechaParaFormulario,
            password: '',
            confirmarPassword: ''
          });
        } else {
          setMensaje({ tipo: 'error', texto: 'Usuario no encontrado en la base de datos' });
        }
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al cargar el perfil desde la base de datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // MISMA FUNCIÓN DE HASH QUE EL VENDEDOR
  const hashPasswordSHA256 = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan si se está cambiando
    if (formData.password && formData.password !== formData.confirmarPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }

    setGuardando(true);
    try {
      const usuarioActual = authService.getCurrentUser();
      if (!usuarioActual || !usuario) {
        throw new Error('Usuario no autenticado');
      }

      // Verificar email existente solo si cambió el correo (CON dataService)
      if (formData.correo && formData.correo !== usuario.correo) {
        try {
          const usuarioConEmail = await dataService.getUsuarioByCorreo(formData.correo);
          if (usuarioConEmail && usuarioConEmail.run !== usuario.run) {
            throw new Error('Ya existe un usuario con este email');
          }
        } catch (error) {
          console.log('No se pudo verificar email, continuando...');
        }
      }

      // SIMPLIFICACIÓN: Usar la fecha directamente sin ajustes complejos
      let fechaParaBackend = formData.fecha_nacimiento || usuario.fechaNac || '';

      // CREAR OBJETO CON LA ESTRUCTURA CORRECTA PARA EL BACKEND
      const datosActualizados = {
        run: usuario.run,
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono ? parseInt(formData.telefono.replace(/\s/g, '')) : null,
        direccion: formData.direccion.trim(),
        comuna: formData.comuna || '',
        region: formData.region || '',
        // SIMPLIFICACIÓN: Enviar la fecha directamente
        fechaNac: fechaParaBackend,
        tipo: usuario.tipo,
        contrasenha: formData.password && formData.password.trim()
          ? await hashPasswordSHA256(formData.password)
          : usuario.contrasenha
      };

      console.log('Fecha enviada al backend:', fechaParaBackend);
      console.log('Datos a enviar ADMIN:', datosActualizados);

      // USAR dataService EN LUGAR DE usuarioService
      await dataService.updateUsuario(datosActualizados);

      // Recargar datos actualizados
      const usuarioActualizado = await dataService.getUsuarioById(usuario.run);
      setUsuario(usuarioActualizado);

      // Actualizar datos en localStorage
      const userData = {
        id: usuarioActualizado.run,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.correo,
        type: usuarioActualizado.tipo,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('auth_user', JSON.stringify(userData));

      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmarPassword: ''
      }));

      setShowModal(false);
      setMensaje({
        tipo: 'success',
        texto: formData.password && formData.password.trim()
          ? 'Perfil y contraseña actualizados correctamente'
          : 'Perfil actualizado correctamente'
      });

      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);

    } catch (error) {
      console.error('Error al actualizar perfil ADMIN:', error);
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error al actualizar el perfil'
      });
    } finally {
      setGuardando(false);
    }
  };

  // AGREGAR LA FUNCIÓN handleDelete QUE FALTABA
  const handleDelete = async () => {
    if (!usuario) return;

    try {
      const usuarios = await dataService.getUsuarios();
      const otrosAdmins = usuarios.filter(u =>
        u.tipo === 'Admin' && u.run !== usuario.run
      );

      if (otrosAdmins.length === 0) {
        setMensaje({
          tipo: 'error',
          texto: 'No se puede eliminar el perfil. Debe haber al menos otro usuario administrador en el sistema.'
        });
        return;
      }

      const confirmacion = window.confirm(
        `¿Estás seguro de que quieres eliminar tu perfil?\n\n` +
        `• Nombre: ${usuario.nombre} ${usuario.apellidos}\n` +
        `• RUN: ${usuario.run}\n` +
        `• Email: ${usuario.correo}\n\n` +
        `Esta acción no se puede deshacer.`
      );

      if (!confirmacion) return;

      await dataService.deleteUsuario(usuario.run);

      setMensaje({
        tipo: 'success',
        texto: 'Perfil eliminado correctamente. Serás redirigido al login.'
      });

      setTimeout(() => {
        authService.logout();
      }, 2000);

    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al eliminar el perfil' });
    }
  };

  return {
    usuario,
    formData,
    loading,
    guardando,
    mensaje,
    showModal,
    handleChange,
    handleSubmit,
    handleDelete, // AGREGAR handleDelete AL RETURN
    setMensaje,
    cargarPerfil,
    setShowModal
  };
};