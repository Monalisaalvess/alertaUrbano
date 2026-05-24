import {Link} from 'react-router-dom';

import GeneralStatus    from '../components/GeneralStatus';
import    MapView       from '../components/MapView';
import  CardComplaint   from '../components/CardComplaint';

import './Home.css';

const Home = () => {
  return (
    <div className='home'>

    <div className='section__1'>
        <div className="section__text">
         <span className="section__sub">Sua cidade. Sua voz. Sua mudança</span> 
          <h1>Sua <span className='sub'>voz</span><br/>
              transforma a cidade.</h1>
          <p>
            Encontre um problema na sua rua ou bairro <br/> e registre aqui. É rápido, simples e faz a cidade melhorar.
          </p>
        <div className='btn'>
          <Link to='/complaint' className="btn__primary">Registrar reclamação</Link>
          <Link to='/cardcComplaint' className="btn__secundary">Registrar reclamação</Link>
        </div>
        </div>

        <div className="section__1__image">
          {/* ilustração da cidade aqui */}
        </div>
      </div>

      <div className="oqRegistrar">
        <div>
          <i className="fa-solid fa-lightbulb"></i>
          <p>Iluminação</p>
        </div>
        <div>
          <i className="fa-solid fa-road-circle-exclamation"></i>
          <p>Buraco</p>
        </div>
        <div>
          <i className="fa-solid fa-faucet-drip"></i>
          <p>Falta de água</p>
        </div>
        <div>
          <i className="fa-solid fa-trash-can"></i>
          <p>Lixo acumulado</p>
        </div>
        <div>
          <i className="fa-solid fa-car-burst"></i>
          <p>Trânsito</p>
        </div>
        <div>
          <i className="fa-solid fa-circle-exclamation"></i>
          <p>Outro</p>
        </div>  
      </div>

     <div className="mapa__container">
        <h2>Mapa de reclamações</h2>
         <div className="mapa__wrapper">

          <div className="mapa">
            <MapView/>
          </div>

          <div className='mapa__legenda'>
            <ul>
              <li><span className="dot dot--pendente"></span> Pendentes</li>
              <li><span className="dot dot--analise"></span> Em análise</li>
              <li><span className="dot dot--resolvida"></span> Resolvidas</li>
            </ul>
          </div>

         </div>
      </div>
    
      <div className='complaints'>
        <h2>Reclamações em destaque</h2>
         
         <div className="complaints__tabs">
          <button className="tab tab--active">Mais curtidas</button>
          <button className="tab">Mais republicadas</button>
         </div>

        <div className="complaints__list">
          <CardComplaint />
        </div>

      </div>

          <GeneralStatus/>

    </div>
  )
}

export default Home