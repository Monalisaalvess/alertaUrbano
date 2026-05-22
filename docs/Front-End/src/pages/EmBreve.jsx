import { Link } from 'react-router-dom'
import './EmBreve.css'
const EmBreve = () => {
  return (
    <div className='embreve'>
      <h2>Em desenvolvimento</h2>
      <p>Nossas redes sociais estarão <span>disponíveis em breve.</span></p>
      <Link to='/' className='btn_back'> <i className="fa-solid fa-arrow-left"></i> Voltar para o início</Link>
    </div>
  )
}

export default EmBreve