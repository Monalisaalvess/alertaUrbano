import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <>
      <footer className='footer'>

        <div className="footer__brand">
          <h1>Alerta<span>Urbano</span></h1>
          <p>Plataforma de reclamações urbanas. Sua voz para transformar a cidade.</p>
        </div>

        <div className="footer__col">
          <h3>Navegação</h3>
          <ul>
            <li><Link to='/'>Início</Link></li>
            <li><Link to='/complaint'>Reclamações</Link></li>
            <li><Link to='/contact'>Contato</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3>Institucional</h3>
          <ul>
            <li><Link to='/about'>Sobre o projeto</Link></li>
            <li><Link to='/termos'>Termos de uso</Link></li>
            <li><Link to='/politica'>Privacidade</Link></li>
          </ul>
        </div>

        <div className="footer__col footer__redes">
          <h3>Redes Sociais</h3>
          <ul>
            <li><Link to='/em-breve'><i className="fa-brands fa-facebook-f"></i></Link></li>
            <li><Link to='/em-breve'><i className="fa-brands fa-instagram"></i></Link></li>
            <li><Link to='/em-breve'><i className="fa-brands fa-tiktok"></i></Link></li>
          </ul>
        </div>

      </footer>

      <div className="copy">
        <p>&copy; 2026 | Desenvolvido por Monalisa</p>
      </div>
    </>
  )
}

export default Footer