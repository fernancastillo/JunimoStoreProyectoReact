import { Routes, Route } from 'react-router-dom'
import Navbar from './components/tienda/Navbar'
import Index from './pages/tienda/Index'
import Login from './pages/tienda/Login'

function App() {
  return (
    <>
      <Navbar/>
      <div className='container mt-4'>
        <Routes>
          <Route path='/index' element={<Index/>}></Route>
          <Route path='/productos' element={<Index/>}></Route>
          <Route path='/carrito' element={<Index/>}></Route>
          <Route path='/blogs' element={<Index/>}></Route>
          <Route path='/nosotros' element={<Index/>}></Route>
          <Route path='/contacto' element={<Index/>}></Route>
          <Route path='/ofertas' element={<Index/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          {/*<Route path='/login' element={<Login/>}></Route>*/}
        </Routes>
      </div>
    </>
  )
}

export default App