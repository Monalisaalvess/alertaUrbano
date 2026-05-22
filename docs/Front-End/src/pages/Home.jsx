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
        {/*  <span className="section__1__local">Crato, Ceará</span> */}
          <h1>Sua voz <br/>
            transforma a cidade.</h1>
          <p>
            Registre problemas da sua rua e bairro.
            Juntos, podemos construir um <span>Crato</span> melhor
            para todos.
          </p>

          <Link to='/complaint' className="btn__primary">Registrar reclamação</Link>

        </div>

        <div className="section__1__image">
          {/* ilustração da cidade aqui */}
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
          {/* cards virão aqui quando integrar com a API */}
          <CardComplaint />
        </div>

      </div>

          <GeneralStatus/>

    </div>
  )
}

export default Home