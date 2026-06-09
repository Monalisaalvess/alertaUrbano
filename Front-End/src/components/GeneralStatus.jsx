import './generalStatus.css'
const GeneralStatus = () => {
  return (
    <div className='general__status'>
      <h2>Status geral</h2>
      <div className="status__cards">

        <div className="status__card status__card--pendente">
          <p>Pendentes</p>
          <h3>0</h3>
        </div>

        <div className="status__card status__card--analise">
          <p>Em análise</p>
          <h3>0</h3>
        </div>

        <div className="status__card status__card--resolvida">
          <p>Resolvidas</p>
          <h3>0</h3>
        </div>

      </div>
    </div>
  )
}

export default GeneralStatus