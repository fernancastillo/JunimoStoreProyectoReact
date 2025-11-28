import { useState, useEffect } from 'react';
import { authService } from '../tienda/authService';
import { dataService } from '../dataService';
import { convertOracleDateToForm } from './dashboardUtils'; // Importar la función de formato

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
                    
                    // CORRECCIÓN: Usar la función de formato para la fecha
                    const fechaBD = usuarioCompleto.fechaNac || usuarioCompleto.fecha_nacimiento;
                    const fechaParaFormulario = convertOracleDateToForm(fechaBD);
                    
                    console.log('VENDEDOR - Fecha desde BD:', fechaBD);
                    console.log('VENDEDOR - Fecha para formulario:', fechaParaFormulario);

                    setFormData({
                        nombre: usuarioCompleto.nombre || '',
                        apellidos: usuarioCompleto.apellidos || '',
                        correo: usuarioCompleto.correo || '',
                        telefono: usuarioCompleto.telefono ? usuarioCompleto.telefono.toString() : '',
                        direccion: usuarioCompleto.direccion || '',
                        comuna: usuarioCompleto.comuna || '',
                        region: usuarioCompleto.region || '',
                        fecha_nacimiento: fechaParaFormulario, // CORREGIDO: usar fecha formateada
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

    // Función para hashear contraseña (simple)
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

        setGuardando(true);
        try {
            const usuarioActual = authService.getCurrentUser();
            if (!usuarioActual || !usuario) {
                throw new Error('Usuario no autenticado');
            }

            // Verificar email existente solo si cambió el correo
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

            // CORRECCIÓN: Usar la función de formato para enviar al backend
            const fechaParaBackend = formData.fecha_nacimiento; // Enviar directamente

            const datosActualizados = {
                run: usuario.run,
                nombre: formData.nombre.trim(),
                apellidos: formData.apellidos.trim(),
                correo: formData.correo.trim(),
                telefono: formData.telefono ? parseInt(formData.telefono.replace(/\s/g, '')) : null,
                direccion: formData.direccion.trim(),
                comuna: formData.comuna || '',
                region: formData.region || '',
                fechaNac: fechaParaBackend, // CORREGIDO: usar fecha procesada
                tipo: usuario.tipo,
                contrasenha: formData.password && formData.password.trim()
                    ? await hashPasswordSHA256(formData.password)
                    : usuario.contrasenha
            };

            console.log('VENDEDOR - Datos a enviar:', datosActualizados);

            await dataService.updateUsuario(datosActualizados);

            // Recargar datos actualizados
            await cargarPerfil();

            // Actualizar datos en localStorage
            const userData = {
                id: usuario.run,
                nombre: formData.nombre,
                email: formData.correo,
                type: usuario.tipo,
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
            setMensaje({ tipo: 'success', texto: 'Perfil actualizado correctamente' });

            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);

        } catch (error) {
            console.error('VENDEDOR - Error al actualizar:', error);
            setMensaje({ tipo: 'error', texto: error.message || 'Error al actualizar el perfil' });
        } finally {
            setGuardando(false);
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
        setMensaje,
        cargarPerfil,
        setShowModal
    };
};