import { Link } from 'react-router-dom'
import './EmBreve.css'
const EmBreve = () => {
  return (
    <div className='embreve'>
      <h2>Página em desenvolvimento</h2>
        <p>Esta página está sendo desenvolvida e estará <span>disponível em breve.</span></p>
      <Link to='/' className='btn_back'> <i className="fa-solid fa-arrow-left"></i> Voltar para o início</Link>
    </div>
  )
}

export default EmBreve