import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportService } from '../services/api'

import './Denuncias.css'

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

const FILTROS_INICIAIS = { status: '', category: '', neighborhood: '' }

const DenunciaCard = ({ denuncia, onClick }) => {
  const status = STATUS_CONFIG[denuncia.status] || STATUS_CONFIG.pendente
  const icone  = CATEGORIA_ICONE[denuncia.category] || 'fa-circle-exclamation'
  const label  = CATEGORIA_LABEL[denuncia.category] || 'Outro'
  const data   = new Date(denuncia.createdAt).toLocaleDateString('pt-BR')

  return (
    <div
      className='denuncias__card'
      onClick={onClick}

      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Ver denúncia: ${denuncia.title}`}
    >
      <div className='denuncias__card__img'>
        <img src={denuncia.image} alt={denuncia.title} />
        <span
          className='denuncias__card__status'
          style={{ color: status.cor, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <div className='denuncias__card__body'>
        <div className='denuncias__card__categoria'>
          <i className={`fa-solid ${icone}`}></i>
          <span>{label}</span>
        </div>

        <h3>{denuncia.title}</h3>
        <p>{denuncia.description}</p>

        <div className='denuncias__card__meta'>
          <span>
            <i className='fa-solid fa-location-dot'></i>{' '}
            {denuncia.location?.neighborhood ?? '—'}
          </span>
          <span>
            <i className='fa-regular fa-calendar'></i> {data}
          </span>
        </div>

        <div className='denuncias__card__footer'>
         
          <span>
            <i className='fa-regular fa-user'></i>{' '}
            {denuncia.userId?.name ?? 'Anônimo'}
          </span>
          <div className='denuncias__card__acoes'>
            <span><i className='fa-regular fa-heart'></i> {denuncia.likes}</span>
            <span><i className='fa-solid fa-retweet'></i> {denuncia.reposts}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Denuncias = () => {
  const navigate = useNavigate()

  const [denuncias, setDenuncias] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [erro,      setErro]      = useState(null)
  const [filtros,   setFiltros]   = useState(FILTROS_INICIAIS)

  const carregarDenuncias = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const res = await reportService.getAll(filtros)
      setDenuncias(res.data)
    } catch (err) {
      console.error('Erro ao carregar denúncias:', err)
      setErro('Não foi possível carregar as denúncias. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    carregarDenuncias()
  }, [carregarDenuncias])

  const handleFiltro = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const limparFiltros = () => setFiltros(FILTROS_INICIAIS)

  const temFiltroAtivo = Object.values(filtros).some(Boolean)

  return (
    <div className='denuncias__page'>

      <div className='denuncias__header'>
        <h1>Denúncias</h1>
        <p>Veja todos os problemas registrados pela população do Crato.</p>
      </div>

    
      <div className='denuncias__filtros'>
        <select name='status' value={filtros.status} onChange={handleFiltro}>
          <option value=''>Todos os status</option>
          <option value='pendente'>Pendente</option>
          <option value='em_analise'>Em análise</option>
          <option value='resolvida'>Resolvida</option>

        </select>

        <select name='category' value={filtros.category} onChange={handleFiltro}>
          <option value=''>Todas as categorias</option>
          <option value='buraco'>Buraco</option>
          <option value='iluminacao'>Iluminação</option>
          <option value='lixo'>Lixo</option>
          <option value='saneamento'>Saneamento</option>
          <option value='seguranca'>Segurança</option>
          <option value='outro'>Outro</option>
        </select>

        <input
          type='text'
          name='neighborhood'
          value={filtros.neighborhood}
          onChange={handleFiltro}
          placeholder='Filtrar por bairro...'
        />

        {temFiltroAtivo && (
          <button className='denuncias__limpar' onClick={limparFiltros}>
            <i className='fa-solid fa-xmark'></i> Limpar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div className='denuncias__loading'>
          <i className='fa-solid fa-spinner fa-spin'></i> Carregando denúncias...
        </div>
      ) : erro ? (
        <div className='denuncias__vazio'>
          <i className='fa-solid fa-triangle-exclamation'></i>
          <p>{erro}</p>
        </div>
      ) : denuncias.length === 0 ? (
        <div className='denuncias__vazio'>
          <i className='fa-solid fa-inbox'></i>
          <p>Nenhuma denúncia encontrada.</p>
        </div>
      ) : (
        <div className='denuncias__grid'>
          {denuncias.map((denuncia) => (
            <DenunciaCard
              key={denuncia._id}
              denuncia={denuncia}
              onClick={() => navigate(`/denuncias/${denuncia._id}`)}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default Denuncias