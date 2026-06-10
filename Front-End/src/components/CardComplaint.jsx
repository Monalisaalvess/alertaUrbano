import './CardComplaint.css'

const CardComplaint = ({ reclamacao }) => {

  if (!reclamacao) return null  // ← remove o card de teste

  const statusConfig = {
    pendente:   { label: 'Pendente',   cor: '#ffba00' },
    em_analise: { label: 'Em análise', cor: '#0c266d' },
    resolvida:  { label: 'Resolvida',  cor: '#0c3b2e' },
  }

  const categoriaIcone = {
    buraco:     'fa-road-circle-exclamation',
    iluminacao: 'fa-lightbulb',
    lixo:       'fa-trash',
    saneamento: 'fa-faucet',
    seguranca:  'fa-shield-halved',
    outro:      'fa-circle-dot',
  }

  const status = statusConfig[reclamacao.status] || statusConfig.pendente
  const icone  = categoriaIcone[reclamacao.category] || 'fa-circle-dot'
  const data   = new Date(reclamacao.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className="card__reclamacao">
      <div className="card__image">
        <img src={reclamacao.image} alt={reclamacao.title} />
        <span className="card__status" style={{ backgroundColor: status.cor }}>
          {status.label}
        </span>
      </div>

      <div className="card__body">
        <div className="card__categoria">
          <i className={`fa-solid ${icone}`}></i>
          <span>{reclamacao.category}</span>
        </div>
        <h3 className="card__title">{reclamacao.title}</h3>
        <p className="card__descricao">{reclamacao.description}</p>
        <div className="card__meta">
          <span><i className="fa-solid fa-location-dot"></i> {reclamacao.location?.neighborhood}</span>
          <span><i className="fa-regular fa-calendar"></i> {data}</span>
        </div>
      </div>

      <div className="card__footer">
        <span className="card__usuario">
          <i className="fa-regular fa-user"></i> {reclamacao.userId?.name}
        </span>
        <div className="card__acoes">
          <button className="card__btn">
            <i className="fa-regular fa-heart"></i> {reclamacao.likes}
          </button>
          <button className="card__btn">
            <i className="fa-solid fa-retweet"></i> {reclamacao.reposts}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardComplaint