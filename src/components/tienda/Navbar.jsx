import { Link } from "react-router-dom"

function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/index">Junimo Store</Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/index">Inicio</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/productos">Productos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/carrito">Carrito</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/blogs">Blogs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/nosotros">Nosotros</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contacto">Contacto</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ofertas">Ofertas</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login/Registrarse</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar