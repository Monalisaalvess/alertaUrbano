import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import './NavBar.css'

const Navbar = () => {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <>
      <div className="navbar__wrapper">
        <nav className='NavBar'>
          <div className="navbar__logo">
            <h2 className='Logo'>
              <Link to='/'>Alerta<span>Urbano</span></Link>
            </h2>
          </div>

          <button
            className={`hamburger ${menuAberto ? 'hamburger--aberto' : ''}`}
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={menuAberto ? 'nav__aberto' : ''}>
            <li onClick={() => setMenuAberto(false)}><Link to='/'>Inicio</Link></li>
            <li onClick={() => setMenuAberto(false)}><Link to='/complaint'>Fazer reclamação</Link></li>
            <li onClick={() => setMenuAberto(false)}><Link to='/Denuncias'>Ver reclamações</Link></li>
            <li onClick={() => setMenuAberto(false)}><Link to='/contact'>Contato</Link></li>

            {isAdmin && (
              <li onClick={() => setMenuAberto(false)}>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
            )}

            {isAuthenticated ? (
              <li onClick={() => setMenuAberto(false)}>
                <Link to='/profile'>
                  <i className='fa-solid fa-user'></i> {user?.name}
                </Link>
              </li>
            ) : (
              <li onClick={() => setMenuAberto(false)}>
                <Link to='/login'>Entrar</Link>
              </li>
            )}
          </ul>
        </nav>

        {isHome && (
          <div className="txt__sub">
            <div className="efeito">
              <p>Sua cidade.&nbsp;&nbsp;&nbsp;Sua voz.&nbsp;&nbsp;&nbsp;Sua mudança</p>
              <p>Sua cidade.&nbsp;&nbsp;&nbsp;Sua voz.&nbsp;&nbsp;&nbsp;Sua mudança</p>
              <p>Sua cidade.&nbsp;&nbsp;&nbsp;Sua voz.&nbsp;&nbsp;&nbsp;Sua mudança</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar