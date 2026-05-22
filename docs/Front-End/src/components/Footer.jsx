import {Link} from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>

        <div className="navbar__footer">
            <h1><Link to='/'>AlertaUrbano</Link></h1>
        </div>

        <div className="nav">
          <h3>Navegação</h3>
            <ul>
                <li><Link to='/'>Inicio</Link></li>
                <li><Link to='/complaint'>Reclamações</Link></li>
                <li><Link to='/contact'>Contato</Link></li>
            </ul>
        </div>

        <div className="nav__institucional">
          <h3>Institucional</h3>
            <ul>
                <li><Link to='/about'>   Sobre o projeto        </Link></li>
                <li><Link to='/termos'>  Termos de uso          </Link></li>
                <li><Link to='/politica'>Politica de privacidade</Link></li>
            </ul>
        </div>
        
        <div className="nav__redes">
          <h3>Redes Sociais</h3>
            <ul>
                <li><Link to='/em-breve'> <i className="fa-brands fa-facebook-f"></i></Link></li>
                <li><Link to='/em-breve'> <i className="fa-brands fa-instagram"> </i></Link></li>
                <li><Link to='/em-breve'> <i className="fa-brands fa-tiktok">    </i></Link></li>
            </ul>
        </div>

    </footer>
  )
}

export default Footer