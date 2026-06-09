import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportService } from '../services/api'
import useAuth from '../hooks/useAuth'

const STATUS_CONFIG = {
  pendente:   { label: 'Pendente',   cor: '#ffba00', bg: '#fffbeb' },
  em_analise: { label: 'Em análise', cor: '#0c266d', bg: '#eff6ff' },
  resolvida:  { label: 'Resolvida',  cor: '#0c3b2e', bg: '#f0fdf4' },
}

const CATEGORIA_ICONE = {
  buraco:     'fa-road-circle-exclamation',
  iluminacao: 'fa-lightbulb',
  lixo:       'fa-trash-can',
  saneamento: 'fa-faucet-drip',
  seguranca:  'fa-shield-halved',
  outro:      'fa-circle-exclamation',
}

const CATEGORIA_LABEL = {
  buraco:     'Buraco',
  iluminacao: 'Iluminação',
  lixo:       'Lixo',
  saneamento: 'Saneamento',
  seguranca:  'Segurança',
  outro:      'Outro',
}

const Denuncia = () => {
  const { id }            = useParams()
  const navigate          = useNavigate()
  const { isAuthenticated } = useAuth()

  const [denuncia,     setDenuncia]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [erro,         setErro]         = useState(null)
  const [curtido,      setCurtido]      = useState(false)
  const [totalLikes,   setTotalLikes]   = useState(0)
  const [totalReposts, setTotalReposts] = useState(0)

  const carregarDenuncia = useCallback(async () => {
    try {
      const res = await reportService.getById(id)
      setDenuncia(res.data)
      setTotalLikes(res.data.likes)
      setTotalReposts(res.data.reposts)
    
      setErro(null)
    } catch (err) {
      
      console.error('Erro ao carregar denúncia:', err)
      setErro('Não foi possível carregar a denúncia. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    carregarDenuncia()
  }, [carregarDenuncia])
  
  const handleCurtir = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      const res = await reportService.like(id)
      setTotalLikes(res.data.likes)
      setCurtido(res.data.liked)
    } catch (err) {
      console.error('Erro ao curtir:', err)
    }
  }

  const handleRepostar = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      const res = await reportService.repost(id)
      setTotalReposts(res.data.reposts)
    } catch (err) {
      console.error('Erro ao repostar:', err)
    }
  }

  if (loading) return (
    <div className='denuncia__loading'>
      <i className='fa-solid fa-spinner fa-spin'></i> Carregando...
    </div>
  )

  if (erro) return (
    <div className='denuncia__loading'>
      <i className='fa-solid fa-triangle-exclamation'></i> {erro}
    </div>
  )

  if (!denuncia) return (
    <div className='denuncia__loading'>
      <i className='fa-solid fa-triangle-exclamation'></i> Denúncia não encontrada.
    </div>
  )

  const status = STATUS_CONFIG[denuncia.status] || STATUS_CONFIG.pendente
  const icone  = CATEGORIA_ICONE[denuncia.category] || 'fa-circle-exclamation'
  const label  = CATEGORIA_LABEL[denuncia.category] || 'Outro'
  const data   = new Date(denuncia.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className='denuncia__page'>

    
      <div className='denuncia__voltar'>
        <button onClick={() => navigate('/denuncias')}>
          <i className='fa-solid fa-arrow-left'></i> Voltar
        </button>
      </div>

      <div className='denuncia__container'>
        <div className='denuncia__imagem'>
          <img src={denuncia.image} alt={denuncia.title} />
        </div>


        <div className='denuncia__conteudo'>

          <div className='denuncia__topo'>
            <span className='denuncia__categoria'>
              <i className={`fa-solid ${icone}`}></i>
      
              {label}
            </span>
            <span
              className='denuncia__status'
              style={{ color: status.cor, backgroundColor: status.bg }}
            >
              {status.label}
            </span>
          </div>

          <h1 className='denuncia__titulo'>{denuncia.title}</h1>

          <p className='denuncia__descricao'>{denuncia.description}</p>


          <div className='denuncia__infos'>

            <div className='denuncia__info__item'>
              <div>
                <span className='denuncia__info__label'>Localização</span>
                <span className='denuncia__info__valor'>

                  {denuncia.location?.address ?? '—'}, {denuncia.location?.neighborhood ?? '—'}
                </span>
              </div>
            </div>

            <div className='denuncia__info__item'>
              <div>
                <span className='denuncia__info__label'>Registrado por</span>
                <span className='denuncia__info__valor'>
                  {denuncia.userId?.name ?? 'Usuário não identificado'}
                </span>
              </div>
            </div>

            <div className='denuncia__info__item'>
              <div>
                <span className='denuncia__info__label'>Data</span>
                <span className='denuncia__info__valor'>{data}</span>
              </div>
            </div>

          </div>

          {denuncia.adminComment && (
            <div className='denuncia__admin__comment'>
              <i className='fa-solid fa-comment-dots'></i>
              <div>
                <span className='denuncia__info__label'>Comentário da prefeitura</span>
                <p>{denuncia.adminComment}</p>
              </div>
            </div>
          )}

          <div className='denuncia__acoes'>
            <button
              className={`denuncia__btn ${curtido ? 'denuncia__btn--curtido' : ''}`}
              onClick={handleCurtir}
              aria-label={curtido ? 'Remover curtida' : 'Curtir denúncia'}
            >
              <i className={`fa-${curtido ? 'solid' : 'regular'} fa-heart`}></i>
              {totalLikes} {totalLikes === 1 ? 'curtida' : 'curtidas'}
            </button>

            <button
              className='denuncia__btn'
              onClick={handleRepostar}
              aria-label='Republicar denúncia'
            >
              <i className='fa-solid fa-retweet'></i>
              {totalReposts} {totalReposts === 1 ? 'republicação' : 'republicações'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Denuncia