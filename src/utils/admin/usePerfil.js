import { useState, useEffect } from 'react';
import { authService } from '../tienda/authService';
import { dataService } from '../dataService';
import {
  formatDateForInput,
  convertFormDateToOracle,
  convertOracleDateToForm,
  debugDate
} from './dashboardUtils';

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

          // USAR LA NUEVA FUNCIÓN ESPECÍFICA PARA ORACLE
          const fechaBD = usuarioCompleto.fechaNac || usuarioCompleto.fecha_nacimiento;
          const fechaParaFormulario = convertOracleDateToForm(fechaBD);

          console.log('=== CARGANDO PERFIL ===');
          debugDate(fechaBD, 'Fecha desde BD');
          console.log('Fecha para formulario:', fechaParaFormulario);

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

      // USAR LA NUEVA FUNCIÓN ESPECÍFICA PARA ORACLE
      const fechaParaBackend = convertFormDateToOracle(formData.fecha_nacimiento);

      console.log('=== GUARDANDO PERFIL ===');
      console.log('Fecha desde formulario:', formData.fecha_nacimiento);
      console.log('Fecha procesada para backend:', fechaParaBackend);

      const datosActualizados = {
        run: usuario.run,
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono ? parseInt(formData.telefono.replace(/\s/g, '')) : null,
        direccion: formData.direccion.trim(),
        comuna: formData.comuna || '',
        region: formData.region || '',
        fechaNac: fechaParaBackend,
        tipo: usuario.tipo,
        contrasenha: formData.password && formData.password.trim()
          ? await hashPasswordSHA256(formData.password)
          : usuario.contrasenha
      };

      console.log('Datos completos a enviar:', datosActualizados);

      await dataService.updateUsuario(datosActualizados);

      await cargarPerfil();

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

  const handleDelete = async () => {
    if (!usuario) return;

    try {
      console.log('Iniciando proceso de eliminación para usuario:', {
        run: usuario.run,
        nombre: usuario.nombre,
        tipo: usuario.tipo
      });

      // Obtener todos los usuarios para verificar si hay otros administradores
      const usuarios = await dataService.getUsuarios();
      console.log('Todos los usuarios obtenidos:', usuarios);

      // Verificar si el usuario actual es administrador
      const esAdministrador = usuario.tipo &&
        (usuario.tipo.toLowerCase() === 'administrador' ||
          usuario.tipo.toLowerCase() === 'admin');

      console.log('Es administrador?:', esAdministrador);

      if (esAdministrador) {
        // Contar administradores excluyendo al usuario actual
        const otrosAdmins = usuarios.filter(u =>
          u && u.tipo &&
          (u.tipo.toLowerCase() === 'administrador' || u.tipo.toLowerCase() === 'admin') &&
          u.run !== usuario.run
        );

        console.log('Otros administradores encontrados:', otrosAdmins);

        // Si no hay otros administradores, bloquear eliminación
        if (otrosAdmins.length === 0) {
          const mensajeError = 'No se puede eliminar el perfil. Debe haber al menos otro usuario administrador en el sistema para mantener la funcionalidad del mismo.';
          console.log(mensajeError);
          throw new Error(mensajeError);
        }
      }

      const confirmacion = window.confirm(
        `¿ESTÁS SEGURO DE QUE QUIERES ELIMINAR TU PERFIL?\n\n` +
        `Esta acción es IRREVERSIBLE y eliminará:\n` +
        `• Tu cuenta completa\n` +
        `• Todas tus órdenes asociadas\n` +
        `• Tu historial en el sistema\n\n` +
        `Información que se eliminará:\n` +
        `• Nombre: ${usuario.nombre} ${usuario.apellidos}\n` +
        `• RUN: ${usuario.run}\n` +
        `• Email: ${usuario.correo}\n` +
        `• Tipo: ${usuario.tipo}\n\n` +
        `¿Continuar con la eliminación?`
      );

      if (!confirmacion) {
        console.log('Eliminación cancelada por el usuario');
        return;
      }

      // Mostrar mensaje de carga
      setMensaje({
        tipo: 'info',
        texto: 'Eliminando perfil y todas las órdenes asociadas...'
      });

      console.log('Ejecutando eliminación del usuario:', usuario.run);
      await dataService.deleteUsuario(usuario.run);

      setMensaje({
        tipo: 'success',
        texto: 'Perfil eliminado correctamente. Serás redirigido al login en 3 segundos.'
      });

      console.log('Perfil eliminado exitosamente, redirigiendo al login...');

      setTimeout(() => {
        authService.logout();
      }, 3000);

    } catch (error) {
      console.error('Error completo al eliminar perfil:', error);

      // Mostrar mensaje de error específico
      let mensajeError = error.message || 'Error al eliminar el perfil';

      // Si es un error de validación de administrador, mostrarlo claramente
      if (mensajeError.includes('otro usuario administrador')) {
        setMensaje({
          tipo: 'error',
          texto: mensajeError
        });
      } else {
        setMensaje({
          tipo: 'error',
          texto: `Error al eliminar el perfil: ${mensajeError}`
        });
      }
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
    handleDelete,
    setMensaje,
    cargarPerfil,
    setShowModal
  };
};