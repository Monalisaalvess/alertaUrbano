import './CardComplaint.css'
const CardComplaint = ({ reclamacao }) => {

  const statusConfig = {
    pendente:   { label: 'Pendente',    cor: '#ffba00' },
    em_analise: { label: 'Em análise',  cor: '#0c266d' },
    resolvida:  { label: 'Resolvida',   cor: '#0c3b2e' },
  }

  const categoriaIcone = {
    buraco:     'fa-road-circle-exclamation',
    iluminacao: 'fa-lightbulb',
    lixo:       'fa-trash',
    saneamento: 'fa-faucet',
    seguranca:  'fa-shield-halved',
    outro:      'fa-circle-dot',
  }

  // Dados mockados para visualizar o card antes da API
  const dados = reclamacao || {
    _id: '1',
    title: 'Buraco na via pública',
    description: 'Buraco enorme na rua que está causando acidentes há semanas sem nenhuma solução.',
    category: 'buraco',
    location: { neighborhood: 'Centro' },
    image: 'https://carroscomcamanzi.com.br/wp-content/uploads/2025/02/buraco-na-rua.jpg',
    status: 'pendente',
    likes: 24,
    reposts: 8,
    usuario: { name: 'Pedro Silva' },
    createdAt: new Date().toISOString(),
  }

  const status = statusConfig[dados.status] || statusConfig.pendente
  const icone = categoriaIcone[dados.category] || '📌Mudar'
  const data = new Date(dados.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className="card__reclamacao">

      <div className="card__image">
        <img src={dados.image} alt={dados.title} />
        <span className="card__status" style={{ backgroundColor: status.cor }}>
          {status.label}
        </span>
      </div>

      <div className="card__body">
        <div className="card__categoria">
          <i className={`fa-solid ${icone}`}></i>
          <span>{dados.category}</span>
        </div>

        <h3 className="card__title">{dados.title}</h3>
        <p className="card__descricao">{dados.description}</p>

        <div className="card__meta">
          <span><i className="fa-solid fa-location-dot"></i> {dados.location?.neighborhood}</span>
          <span><i className="fa-regular fa-calendar"></i> {data}</span>
        </div>
      </div>

      <div className="card__footer">
        <span className="card__usuario">
          <i className="fa-regular fa-user"></i> {dados.usuario?.name}
        </span>

        <div className="card__acoes">
          <button className="card__btn">
            <i className="fa-regular fa-heart"></i> {dados.likes}
          </button>
          <button className="card__btn">
            <i className="fa-solid fa-retweet"></i> {dados.reposts}
          </button>
        </div>

    </div>
    </div>
)
}
export default CardComplaint;