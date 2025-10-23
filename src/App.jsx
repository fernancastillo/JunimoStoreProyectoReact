import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/tienda/Navbar'
import Index from './pages/tienda/Index'
import Login from './pages/tienda/Login'
import Dashboard from './pages/admin/Dashboard'
import Ordenes from './pages/admin/Ordenes'
import Productos from './pages/admin/Productos'
import Usuarios from './pages/admin/Usuarios'
import Perfil from './pages/admin/Perfil'
import AdminSidebar, { AdminMobileNavbar } from './components/admin/AdminSidebar'

function App() {
  return (
    <>
      <Routes>
        {/* RUTAS DE ADMIN */}
        <Route path="/admin/*" element={
          <div className="container-fluid p-0">
            {/* Navbar móvil */}
            <AdminMobileNavbar />
            
            <div className="row g-0">
              <div className="col-lg-1 col-md-2 d-none d-md-block min-vh-100">
                <AdminSidebar />
              </div>
              
              {/* Contenido principal */}
              <div className="col-lg-11 col-md-10 ms-auto">
                {/* Espacio para el navbar fijo en móviles */}
                <div className="d-md-none" style={{ height: '70px' }}></div>
                <div className="container-fluid mt-4">
                  <Routes>
                    <Route path='/dashboard' element={<Dashboard/>} />
                    <Route path='/ordenes' element={<Ordenes/>} />
                    <Route path='/productos' element={<Productos/>} />
                    <Route path='/usuarios' element={<Usuarios/>} />
                    <Route path='/perfil' element={<Perfil/>} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        } />
        
        {/* ✅ RUTAS PÚBLICAS - CON NAVBAR EN TOP */}
        <Route path="/*" element={
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <div className="container-fluid mt-4">
                <Routes>
                  <Route path='/index' element={<Index/>} />
                  <Route path='/productos' element={<Index/>} />
                  <Route path='/carrito' element={<Index/>} />
                  <Route path='/blogs' element={<Index/>} />
                  <Route path='/nosotros' element={<Index/>} />
                  <Route path='/contacto' element={<Index/>} />
                  <Route path='/ofertas' element={<Index/>} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/' element={<Navigate to="/index" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        } />
      </Routes>
    </>
  )
}

export default App