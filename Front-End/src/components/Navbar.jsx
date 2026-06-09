import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

import './NavBar.css'
const Navbar = () => {
const { isAuthenticated, isAdmin, user } = useAuth()
  return (
    <>
    <div className="navbar__wrapper">
    <nav className='NavBar'>
      <div className="navbar__logo">
        <h2 className='Logo'>Alerta<span>Urbano</span><Link to='/'></Link></h2>
      </div>

      <ul>
        <li><Link to='/'>Inicio</Link></li>
        <li><Link to='/complaint'>Fazer reclamação</Link></li>
        <li><Link to='/Denuncias'>Ver reclamações</Link></li>
        <li><Link to='/contact'>Contato</Link></li>

        {isAdmin && (
          <li><Link to='/dashboard'>Dashboard</Link></li>
        )}

        {isAuthenticated ? (
          <li><Link to='/profile'>
            <i className='fa-solid fa-user'></i> {user?.name}
          </Link></li>
        ) : (
          <li><Link to='/login'>Entrar</Link></li>
        )}
      </ul>
    </nav>
    <div className="txt__sub">
      <div className="efeito">
        <p>Sua cidade.     Sua voz.     Sua mudança</p>
        <p>Sua cidade.     Sua voz.     Sua mudança</p>
        <p>Sua cidade.     Sua voz.     Sua mudança</p>
    </div>
    </div>
    </div>
    </>
  )
}

export default Navbar