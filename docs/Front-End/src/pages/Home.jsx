import {useState} from 'react';
import {Link}     from 'react-router-dom';

import GeneralStatus    from '../components/GeneralStatus';
import    MapView       from '../components/MapView';
import  CardComplaint   from '../components/CardComplaint';

import './Home.css';

const CATEGORIAS = [
  { icone: 'fa-lightbulb',            label: 'Iluminação'     },
  { icone: 'fa-road-circle-exclamation', label: 'Buraco'      },
  { icone: 'fa-faucet-drip',          label: 'Falta de água'  },
  { icone: 'fa-trash-can',            label: 'Lixo acumulado' },
  { icone: 'fa-car-burst',            label: 'Trânsito'       },
  { icone: 'fa-circle-exclamation',   label: 'Outro'          },
]
 
const LEGENDA_MAPA = [
  { classe: 'dot--pendente', label: 'Pendentes'  },
  { classe: 'dot--analise',  label: 'Em análise' },
  { classe: 'dot--resolvida',label: 'Resolvidas' },
]

const TABS = ['Mais curtidas', 'Mais republicadas']

const Home = () => {
  const [ tabAtiva, setTabAtiva] = useState(0)
  return (
    <div className='home'>
      <section className='section__1'>
        <div className="section__text"> 
          <h1>Sua <span className='sub'>voz</span><br/>
              transforma a cidade.
          </h1>
          <p>
            Encontre um problema na sua rua ou bairro e registre aqui. É rápido, simples e faz a cidade melhorar.
          </p>
        <div className='btn'>
          <Link to='/complaint' className="btn__primary">Registrar reclamação</Link>
          <Link to='/denuncias' className="btn__secundary">Ver reclamações</Link>
        </div>
       </div>
      </section>

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

        <div className='mapa__legenda'>
          <ul>
            {LEGENDA_MAPA.map(({ classe, label }) => (
              <li key={label}>
                <span className={`dot ${classe}`}></span> {label}
              </li>
              ))}
          </ul>
        </div>

          <div className="mapa">
            <MapView/>
          </div>


         </div>
      </div>
    
      <section className='complaints'>
        <h2>Reclamações em destaque</h2>
         
         <div className='complaints__tabs'>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`tab ${tabAtiva === i ? 'tab--active' : ''}`}
              onClick={() => setTabAtiva(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="complaints__list">
          <CardComplaint tab={tabAtiva}/>
        </div>

      </section>

          <GeneralStatus/>

    </div>
  )
}

export default Home