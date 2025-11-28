import { useState, useEffect } from 'react';
import { usePerfil } from '../../utils/admin/usePerfil';
import PerfilForm from '../../components/admin/PerfilForm';
import PerfilModal from '../../components/admin/PerfilModal';
import { authService } from '../../utils/tienda/authService';
import { formatDate } from '../../utils/vendedor/dashboardUtils';

const Perfil = () => {
    const {
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
    } = usePerfil();

    // AGREGAR ESTE USEEFFECT PARA EL FONDO
    useEffect(() => {
        document.body.style.backgroundImage = 'url("../src/assets/tienda/fondostardew.png")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.minHeight = '100vh';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.body.style.minHeight = '';
        };
    }, []);

    // Función para mostrar el tipo de usuario de forma legible
    const getTipoUsuarioDisplay = (tipo) => {
        const tipos = {
            'administrador': 'Administrador',
            'admin': 'Administrador', 
            'vendedor': 'Vendedor',
            'cliente': 'Cliente'
        };
        return tipos[tipo?.toLowerCase()] || tipo || 'Usuario';
    };

    // Función para manejar la eliminación del perfil
    const handleEliminarPerfil = async () => {
        if (!usuario) return;

        try {
            await handleDelete();
        } catch (error) {
            console.error('Error al eliminar perfil:', error);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando perfil...</span>
                    </div>
                    <span className="ms-2 text-white">Cargando información del perfil...</span>
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
                <div className="alert alert-danger">
                    No se pudo cargar la información del perfil
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0 fw-bold text-white" style={{ 
                    fontFamily: "'Indie Flower', cursive", 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)' 
                }}>
                    Mi Perfil
                </h1>
                <div className="text-white fw-medium">
                    <i className="bi bi-person-gear me-2"></i>
                    {getTipoUsuarioDisplay(usuario.tipo)}
                </div>
            </div>

            {/* Mensajes */}
            {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show mb-4`}>
                    {mensaje.texto}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMensaje({ tipo: '', texto: '' })}
                    ></button>
                </div>
            )}

            <div className="row">
                {/* Información del perfil */}
                <div className="col-xl-8 col-lg-7">
                    <PerfilForm
                        usuario={usuario}
                        onEdit={() => setShowModal(true)}
                        onDelete={handleEliminarPerfil}
                    />
                </div>

                {/* Sidebar con información adicional */}
                <div className="col-xl-4 col-lg-5">
                    {/* Tarjeta de resumen */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header border-0 bg-transparent">
                            <h6 className="m-0 fw-bold text-dark" style={{ fontFamily: "'Indie Flower', cursive" }}>
                                Resumen
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="text-center">
                                <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-person-gear text-white" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h5 className="fw-bold text-dark">{usuario.nombre} {usuario.apellidos}</h5>
                                <p className="text-muted mb-3">{usuario.correo}</p>

                                <div className="d-flex justify-content-between border-top pt-3">
                                    <div className="text-center">
                                        <div className="text-primary fw-bold">{usuario.run}</div>
                                        <small className="text-muted">RUN</small>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-warning fw-bold">
                                            {getTipoUsuarioDisplay(usuario.tipo)}
                                        </div>
                                        <small className="text-muted">Rol</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de advertencia para administradores */}
                    {usuario.tipo && usuario.tipo.toLowerCase() === 'administrador' && (
                        <div className="card shadow-sm border-warning">
                            <div className="card-header bg-warning text-dark border-warning">
                                <h6 className="m-0 fw-bold">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Advertencia Importante
                                </h6>
                            </div>
                            <div className="card-body">
                                <p className="small text-muted mb-0">
                                    <strong>Como administrador</strong>, tu cuenta es esencial para el sistema. 
                                    Solo podrás eliminar tu perfil si existe al menos otro usuario administrador.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de edición */}
            <PerfilModal
                show={showModal}
                usuario={usuario}
                formData={formData}
                guardando={guardando}
                onClose={() => {
                    setShowModal(false);
                }}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Perfil;