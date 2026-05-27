import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

import './NavBar.css'
const Navbar = () => {
const { isAuthenticated, isAdmin, user } = useAuth()
  return (
    <nav className='NavBar'>
      <div className="navbar__logo">
        <h2 className='Logo'>AlertaUrbano<Link to='/'></Link></h2>
      </div>

      <ul>
        <li><Link to='/'>Inicio</Link></li>
        <li><Link to='/complaint'>Reclamações</Link></li>
        <li><Link to='/Denuncias'>Denuncias</Link></li>
        <li><Link to='/contact'>Contato</Link></li>

        {isAdmin && (
          <li><Link to='/dashboard'>Dashboard</Link></li>
        )}

        {isAuthenticated ? (
          <li><Link to='/perfil'>
            <i className='fa-solid fa-user'></i> {user?.name}
          </Link></li>
        ) : (
          <li><Link to='/login'>Entrar</Link></li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar