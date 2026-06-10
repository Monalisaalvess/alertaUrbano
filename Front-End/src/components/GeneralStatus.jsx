import { useEffect, useState } from 'react'
import { reportService } from '../services/api'
import './generalStatus.css'

const useCountUp = (target, duration = 1500) => {
  const [count, setCount]= useState(0)
  useEffect(()=>{
    if (target === 0) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return count
}
  const GeneralStatus = () => {
    const [stats, setStats] = useState({ pendentes: 0, analise: 0, resolvidas: 0 })

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const res = await reportService.getStats() 
          setStats (res.data.byStatus)
        } catch (err) {
          console.error('Erro ao buscar stats:', err)
        }
      }
      fetchStats()
    }, [])
    const pendente   = useCountUp(stats.pendente)
    const em_analise = useCountUp(stats.em_analise)
    const resolvida  = useCountUp(stats.resolvida)
    
  return (
    <div className='general__status'>
      <h2>Status geral de reclamações</h2>
      <div className="status__cards">

        <div className="status__card status__card--pendente">
          <p>Pendentes</p>
          <h3>{pendente}</h3>
        </div>

        <div className="status__card status__card--analise">
          <p>Em análise</p>
          <h3>{em_analise}</h3>
        </div>

        <div className="status__card status__card--resolvida">
          <p>Resolvidas</p>
          <h3>{resolvida}</h3>
        </div>

      </div>
    </div>
  )
}

export default GeneralStatus