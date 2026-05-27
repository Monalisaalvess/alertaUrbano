import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportService } from '../services/api'

const statusConfig = {
  pendente:   { label: 'Pendente',   cor: '#f59e0b', bg: '#fffbeb' },
  em_analise: { label: 'Em análise', cor: '#3b82f6', bg: '#eff6ff' },
  resolvida:  { label: 'Resolvida',  cor: '#22c55e', bg: '#f0fdf4' },
}

const categoriaIcone = {
  buraco:     'fa-road-circle-exclamation',
  iluminacao: 'fa-lightbulb',
  lixo:       'fa-trash-can',
  saneamento: 'fa-faucet-drip',
  seguranca:  'fa-shield-halved',
  outro:      'fa-circle-exclamation',
}

const categoriaLabel = {
  buraco:     'Buraco',
  iluminacao: 'Iluminação',
  lixo:       'Lixo',
  saneamento: 'Saneamento',
  seguranca:  'Segurança',
  outro:      'Outro',
}

const Denuncias = () => {
  const navigate = useNavigate()
  const [denuncias, setDenuncias] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({ status: '', category: '', neighborhood: '' })

  useEffect(() => {
    carregarDenuncias()
  }, [filtros])

  const carregarDenuncias = async () => {
    setLoading(true)
    try {
      const res = await reportService.getAll(filtros)
      setDenuncias(res.data)
    } catch (err) {
      console.error('Erro ao carregar denúncias:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltro = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const limparFiltros = () => {
    setFiltros({ status: '', category: '', neighborhood: '' })
  }

  return (
    <div className='denuncias__page'>

      <div className='denuncias__header'>
        <div>
          <h1>Denúncias</h1>
          <p>Veja todos os problemas registrados pela população do Crato.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className='denuncias__filtros'>
        <select name='status' value={filtros.status} onChange={handleFiltro}>
          <option value=''>Todos os status</option>
          <option value='pendente'>Pendente</option>
          <option value='em_analise'>Em análise</option>
          <option value='resolvida'>Resolvida</option>
          <option value='duplicada'>Duplicada</option>
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

        {(filtros.status || filtros.category || filtros.neighborhood) && (
          <button className='denuncias__limpar' onClick={limparFiltros}>
            <i className='fa-solid fa-xmark'></i> Limpar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div className='denuncias__loading'>
          <i className='fa-solid fa-spinner fa-spin'></i> Carregando denúncias...
        </div>
      ) : denuncias.length === 0 ? (
        <div className='denuncias__vazio'>
          <i className='fa-solid fa-inbox'></i>
          <p>Nenhuma denúncia encontrada.</p>
        </div>
      ) : (
        <div className='denuncias__grid'>
          {denuncias.map((d) => {
            const status = statusConfig[d.status] || statusConfig.pendente
            const icone = categoriaIcone[d.category] || 'fa-circle-exclamation'
            const data = new Date(d.createdAt).toLocaleDateString('pt-BR')

            return (
              <div
                key={d._id}
                className='denuncias__card'
                onClick={() => navigate(`/denuncias/${d._id}`)}
              >
                <div className='denuncias__card__img'>
                  <img src={d.image} alt={d.title} />
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
                    <span>{categoriaLabel[d.category]}</span>
                  </div>

                  <h3>{d.title}</h3>
                  <p>{d.description}</p>

                  <div className='denuncias__card__meta'>
                    <span><i className='fa-solid fa-location-dot'></i> {d.location?.neighborhood}</span>
                    <span><i className='fa-regular fa-calendar'></i> {data}</span>
                  </div>

                  <div className='denuncias__card__footer'>
                    <span><i className='fa-regular fa-user'></i> {d.userId?.name}</span>
                    <div className='denuncias__card__acoes'>
                      <span><i className='fa-regular fa-heart'></i> {d.likes}</span>
                      <span><i className='fa-solid fa-retweet'></i> {d.reposts}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Denuncias