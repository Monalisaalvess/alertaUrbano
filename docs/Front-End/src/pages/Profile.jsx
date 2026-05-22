import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { reportService } from '../services/api'

import './Profile.css'
const statusConfig = {
  pendente:   { label: 'Pendente',   cor: '#f59e0b' },
  em_analise: { label: 'Em análise', cor: '#3b82f6' },
  resolvida:  { label: 'Resolvida',  cor: '#22c55e' },
  duplicada:  { label: 'Duplicada',  cor: '#ef4444' },
}

const categoriaIcone = {
  buraco:     'fa-road-circle-exclamation',
  iluminacao: 'fa-lightbulb',
  lixo:       'fa-trash',
  saneamento: 'fa-faucet',
  seguranca:  'fa-shield-halved',
  outro:      'fa-circle-dot',
}

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const [reclamacoes, setReclamacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    carregarReclamacoes()
  }, [isAuthenticated])

  const carregarReclamacoes = async () => {
    try {
      const res = await reportService.getUserReports(user.id)
      setReclamacoes(res.data)
    } catch (err) {
      console.error('Erro ao carregar reclamações:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const totalResolvidas = reclamacoes.filter(r => r.status === 'resolvida').length
  const totalPendentes = reclamacoes.filter(r => r.status === 'pendente').length
  const totalEmAnalise = reclamacoes.filter(r => r.status === 'em_analise').length

  return (
    <div className='perfil__page'>

      {/* Sidebar */}
      <div className='perfil__sidebar'>

        <div className='perfil__avatar'>
          <div className='perfil__avatar__img'>
            <i className='fa-solid fa-user'></i>
          </div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className='perfil__cidade'>
            <i className='fa-solid fa-location-dot'></i> Crato — CE
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

      </div>

      {/* Lista de reclamações */}
      <div className='perfil__conteudo'>
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
            {reclamacoes.map((r) => {
              const status = statusConfig[r.status] || statusConfig.pendente
              const icone = categoriaIcone[r.category] || 'fa-circle-dot'
              const data = new Date(r.createdAt).toLocaleDateString('pt-BR')

              return (
                <div key={r._id} className='perfil__card'>
                  <div className='perfil__card__img'>
                    <img src={r.image} alt={r.title} />
                  </div>

                  <div className='perfil__card__body'>
                    <div className='perfil__card__top'>
                      <span className='perfil__card__categoria'>
                        <i className={`fa-solid ${icone}`}></i> {r.category}
                      </span>
                      <span
                        className='perfil__card__status'
                        style={{ color: status.cor }}
                      >
                        ● {status.label}
                      </span>
                    </div>

                    <h3>{r.title}</h3>
                    <p>{r.description}</p>

                    <div className='perfil__card__meta'>
                      <span>
                        <i className='fa-solid fa-location-dot'></i> {r.location?.neighborhood}
                      </span>
                      <span>
                        <i className='fa-regular fa-calendar'></i> {data}
                      </span>
                      <span>
                        <i className='fa-regular fa-heart'></i> {r.likes}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

export default Profile