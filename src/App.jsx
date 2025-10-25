import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/tienda/Navbar/Navbar'
import Footer from './components/tienda/Footer/Footer'
import Index from './pages/tienda/Index'
import Login from './pages/tienda/Login'
import RegistroUsuario from './pages/tienda/RegistroUsuario'
import Dashboard from './pages/admin/Dashboard'
import Ordenes from './pages/admin/Ordenes'
import Productos from './pages/admin/Productos'
import Usuarios from './pages/admin/Usuarios'
import Perfil from './pages/admin/Perfil'
import ProductoDetalle from './pages/tienda/productoDetalle';
import TiendaProductos from './pages/tienda/Productos';
import Nosotros from './pages/tienda/Nosotros';
import AdminSidebar, { AdminMobileNavbar } from './components/admin/AdminSidebar'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute' 

function App() {
  return (
    <>
      <Routes>
        {/* RUTAS DE ADMIN */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <div className="container-fluid p-0">
              <AdminMobileNavbar />
              
              <div className="row g-0">
                <div className="col-lg-1 col-md-2 d-none d-md-block min-vh-100">
                  <AdminSidebar />
                </div>
                
                <div className="col-lg-11 col-md-10 ms-auto">
                  <div className="d-md-none" style={{ height: '70px' }}></div>
                  <div className="container-fluid mt-4">
                    <Routes>
                      <Route path='/dashboard' element={<Dashboard/>} />
                      <Route path='/ordenes' element={<Ordenes/>} />
                      <Route path='/productos' element={<Productos/>} />
                      <Route path='/usuarios' element={<Usuarios/>} />
                      <Route path='/perfil' element={<Perfil/>} />
                      <Route path='/' element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />
        
        {/* RUTAS PÚBLICAS */}
        <Route path="/*" element={
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <div className="container-fluid mt-4">
                <Routes>
                  <Route path='/index' element={<Index/>} />
                  <Route path='/productos' element={<TiendaProductos/>} />
                  <Route path="/producto/:codigo" element={<ProductoDetalle />} />
                  <Route path='/carrito' element={<Index/>} />
                  <Route path='/blogs' element={<Index/>} />
                  <Route path='/nosotros' element={<Nosotros/>} />
                  <Route path='/contacto' element={<Index/>} />
                  <Route path='/ofertas' element={<Index/>} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/registro' element={<RegistroUsuario/>} /> {/* Nueva ruta */}
                  <Route path='/' element={<Navigate to="/index" replace />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  )
}

export default App