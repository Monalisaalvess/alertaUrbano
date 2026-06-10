import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';

import GeneralStatus from '../components/GeneralStatus';
import MapView       from '../components/MapView';
import CardComplaint from '../components/CardComplaint';
import { reportService } from '../services/api';

import './Home.css';

const LEGENDA_MAPA = [
  { classe: 'dot--pendente',  label: 'Pendentes'  },
  { classe: 'dot--analise',   label: 'Em análise' },
  { classe: 'dot--resolvida', label: 'Resolvidas' },
]

const TABS = ['Mais curtidas', 'Mais republicadas']

const Home = () => {
  const [tabAtiva, setTabAtiva]       = useState(0)
  const [reclamacoes, setReclamacoes] = useState([])
  const [carregando, setCarregando]   = useState(true)

  useEffect(() => {
    const buscarDestaques = async () => {
      try {
        setCarregando(true)
        const res  = await reportService.getHighlights()
        const data = res.data

        // tab 0 = mais curtidas, tab 1 = mais republicadas
        const lista = tabAtiva === 0 ? data.mostLiked : data.mostReposted
        setReclamacoes(lista)
      } catch (err) {
        console.error('Erro ao buscar destaques:', err)
      } finally {
        setCarregando(false)
      }
    }

    buscarDestaques()
  }, [tabAtiva]) // rebusca sempre que trocar de tab

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
            <Link to='/denuncias' className="btn__secondary">Ver reclamações</Link>
          </div>
        </div>
        <GeneralStatus />
      </section>

      <div className="oqRegistrar">
        <div><i className="fa-solid fa-lightbulb"></i><p>Iluminação</p></div>
        <div><i className="fa-solid fa-road-circle-exclamation"></i><p>Buraco</p></div>
        <div><i className="fa-solid fa-faucet-drip"></i><p>Falta de água</p></div>
        <div><i className="fa-solid fa-trash-can"></i><p>Lixo acumulado</p></div>
        <div><i className="fa-solid fa-car-burst"></i><p>Trânsito</p></div>
        <div><i className="fa-solid fa-circle-exclamation"></i><p>Outro</p></div>
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
          {carregando ? (
            <p style={{ color: '#71717a', fontSize: '0.95rem' }}>Carregando...</p>
          ) : reclamacoes.length === 0 ? (
            <p style={{ color: '#71717a', fontSize: '0.95rem' }}>Nenhuma reclamação encontrada.</p>
          ) : (
            reclamacoes.map((r) => (
              <CardComplaint key={r._id} reclamacao={r} />
            ))
          )}
        </div>
      </section>

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
            <MapView />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home