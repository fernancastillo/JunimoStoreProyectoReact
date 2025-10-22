import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../utils/tienda/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        // Redirigir según el tipo de usuario
        navigate(result.redirectTo);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>

            <hr className="my-4" />

            <div className="text-center">
              <p className="mb-0">¿No tienes una cuenta?</p>
              <Link to="/register" className="btn btn-outline-primary mt-2">
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;