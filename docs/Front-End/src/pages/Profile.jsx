import { useState, useEffect, useCallback } from 'react'
import { useNavigate }   from 'react-router-dom'
import { reportService } from '../services/api'
import useAuth from '../hooks/useAuth'
import './Profile.css'

const STATUS_CONFIG = {
  pendente:   { label: 'Pendente',   cor: '#f59e0b' },
  em_analise: { label: 'Em análise', cor: '#3b82f6' },
  resolvida:  { label: 'Resolvida',  cor: '#22c55e' },
}

const CATEGORIA_ICONE = {
  buraco:     'fa-road-circle-exclamation',
  iluminacao: 'fa-lightbulb',
  lixo:       'fa-trash',
  saneamento: 'fa-faucet',
  seguranca:  'fa-shield-halved',
  outro:      'fa-circle-dot',
}

const ReclamacaoCard = ({ reclamacao }) => {
  const status = STATUS_CONFIG[reclamacao.status] || STATUS_CONFIG.pendente
  const icone  = CATEGORIA_ICONE[reclamacao.category] || 'fa-circle-dot'
  const data   = new Date(reclamacao.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className='perfil__card'>
      <div className='perfil__card__img'>
        <img src={reclamacao.image} alt={reclamacao.title} />
      </div>

      <div className='perfil__card__body'>
        <div className='perfil__card__top'>
          <span className='perfil__card__categoria'>
            <i className={`fa-solid ${icone}`}></i> {reclamacao.category}
          </span>
          <span className='perfil__card__status' style={{ color: status.cor }}>
            ● {status.label}
          </span>
        </div>

        <h3>{reclamacao.title}</h3>
        <p>{reclamacao.description}</p>

        <div className='perfil__card__meta'>
          <span>
            <i className='fa-solid fa-location-dot'></i> {reclamacao.location?.neighborhood}
          </span>
          <span>
            <i className='fa-regular fa-calendar'></i> {data}
          </span>
          <span>
            <i className='fa-regular fa-heart'></i> {reclamacao.likes}
          </span>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const [reclamacoes, setReclamacoes] = useState([])
  const [loading, setLoading]         = useState(true)

  const carregarReclamacoes = useCallback(async () => {
    try {
      const res = await reportService.getUserReports(user.id)
      setReclamacoes(res.data)
    } catch (err) {
      console.error('Erro ao carregar reclamações do usuário:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    carregarReclamacoes()
  }, [isAuthenticated, carregarReclamacoes])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const totalResolvidas = reclamacoes.filter(r => r.status === 'resolvida').length
  const totalPendentes  = reclamacoes.filter(r => r.status === 'pendente').length
  const totalEmAnalise  = reclamacoes.filter(r => r.status === 'em_analise').length

  return (
    <div className='perfil__page'>

      <aside className='perfil__sidebar'>

        <div className='perfil__avatar'>
          <div className='perfil__avatar__img'>
            <i className='fa-solid fa-user'></i>
          </div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className='perfil__cidade'>
            <i className='fa-solid fa-location-dot'></i>{' '}
            {user?.city ?? 'Crato CE'}
          </span>
        </div>
        <div className='perfil__stats'>
          <div className='perfil__stat'>
            <h3>{reclamacoes.length}</h3>
            <p>Reclamações feitas</p>
          </div>
          <div className='perfil__stat'>
            <h3>{totalResolvidas}</h3>
            <p>Resolvidas</p>
          </div>
        </div>
        <div className='perfil__mini__stats'>
          <div className='perfil__mini__stat'>
            <span className='dot dot--pendente'></span>
            <span>{totalPendentes} Pendentes</span>
          </div>
          <div className='perfil__mini__stat'>
            <span className='dot dot--analise'></span>
            <span>{totalEmAnalise} Em análise</span>
          </div>
          <div className='perfil__mini__stat'>
            <span className='dot dot--resolvida'></span>
            <span>{totalResolvidas} Resolvidas</span>
          </div>
        </div>
        <button className='perfil__logout' onClick={handleLogout}>
          <i className='fa-solid fa-right-from-bracket'></i> Sair
        </button>
      </aside>

      <main className='perfil__conteudo'>
        <h2 className='perfil__conteudo__titulo'>Minhas reclamações</h2>
            {loading ? (
          <div className='perfil__loading'>
            <i className='fa-solid fa-spinner fa-spin'></i> Carregando...
          </div>
          ) : reclamacoes.length === 0 ? (
          <div className='perfil__vazio'>
            <i className='fa-solid fa-inbox'></i>
            <p>Você ainda não fez nenhuma reclamação.</p>
            <button className='btn__primary' onClick={() => navigate('/complaint')}>
              Registrar reclamação
            </button>
          </div>
          ) : (
          <div className='perfil__lista'>
            {reclamacoes.map((reclamacao) => (
              <ReclamacaoCard key={reclamacao._id ?? reclamacao.id} reclamacao={reclamacao} />
            ))}
          </div>

        )}
      </main>
    </div>
  )
}

export default Profile