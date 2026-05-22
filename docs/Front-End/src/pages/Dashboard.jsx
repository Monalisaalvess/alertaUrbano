import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { adminService } from '../services/api'

import './Dashboard.css'
const statusConfig = {
  pendente:   { label: 'Pendente',   cor: '#f59e0b', bg: '#fffbeb' },
  em_analise: { label: 'Em análise', cor: '#3b82f6', bg: '#eff6ff' },
  resolvida:  { label: 'Resolvida',  cor: '#22c55e', bg: '#f0fdf4' },
}

const categoriaLabel = {
  buraco:     'Buraco',
  iluminacao: 'Iluminação',
  lixo:       'Lixo',
  saneamento: 'Saneamento',
  seguranca:  'Segurança',
  outro:      'Outro',
}

const Dashboard = () => {
  const { isAdmin, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtros, setFiltros] = useState({ status: '', category: '', neighborhood: '' })
  const [modalAberto, setModalAberto] = useState(false)
  const [reclamacaoSelecionada, setReclamacaoSelecionada] = useState(null)
  const [novoStatus, setNovoStatus] = useState('')
  const [comentarioAdmin, setComentarioAdmin] = useState('')
  const [abaAtiva, setAbaAtiva] = useState('dashboard')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/')
      return
    }
    carregarDados()
  }, [isAuthenticated, isAdmin])

  useEffect(() => {
    carregarReports()
  }, [pagina, filtros])

  const carregarDados = async () => {
    try {
      const res = await adminService.getStats()
      setStats(res.data)
    } catch (err) {
      console.error('Erro ao carregar stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const carregarReports = async () => {
    try {
      const res = await adminService.getReports({ ...filtros, page: pagina, limit: 10 })
      setReports(res.data.reports)
      setTotalPaginas(res.data.pagination.pages)
    } catch (err) {
      console.error('Erro ao carregar reports:', err)
    }
  }

  const abrirModal = (report) => {
    setReclamacaoSelecionada(report)
    setNovoStatus(report.status)
    setComentarioAdmin(report.adminComment || '')
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setReclamacaoSelecionada(null)
    setNovoStatus('')
    setComentarioAdmin('')
  }

  const salvarStatus = async () => {
    setSalvando(true)
    try {
      await adminService.updateStatus(reclamacaoSelecionada._id, {
        status: novoStatus,
        adminComment: comentarioAdmin,
      })
      fecharModal()
      carregarReports()
      carregarDados()
    } catch (err) {
      console.error('Erro ao salvar status:', err)
    } finally {
      setSalvando(false)
    }
  }

  const deletarReport = async (id) => {
    if (!confirm('Tem certeza que deseja remover esta reclamação?')) return
    try {
      await adminService.deleteReport(id)
      carregarReports()
      carregarDados()
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
  }

  const handleFiltro = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
    setPagina(1)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Dados para gráfico de categorias
  const maxCategoria = stats?.byCategory?.[0]?.total || 1

  return (
    <div className='dashboard__page'>

      {/* Sidebar */}
      <div className='dashboard__sidebar'>
        <div className='dashboard__sidebar__logo'>
          <h2>CidadeViva</h2>
          <span>Admin</span>
        </div>

        <nav className='dashboard__nav'>
          <button
            className={`dashboard__nav__item ${abaAtiva === 'dashboard' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('dashboard')}
          >
            <i className='fa-solid fa-chart-line'></i> Dashboard
          </button>
          <button
            className={`dashboard__nav__item ${abaAtiva === 'reclamacoes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('reclamacoes')}
          >
            <i className='fa-solid fa-triangle-exclamation'></i> Reclamações
          </button>
        </nav>

        <button className='dashboard__logout' onClick={handleLogout}>
          <i className='fa-solid fa-right-from-bracket'></i> Sair
        </button>
      </div>

      {/* Conteúdo */}
      <div className='dashboard__conteudo'>

        {/* ABA DASHBOARD */}
        {abaAtiva === 'dashboard' && (
          <>
            <h1 className='dashboard__titulo'>Dashboard</h1>

            {loading ? (
              <div className='dashboard__loading'>
                <i className='fa-solid fa-spinner fa-spin'></i> Carregando...
              </div>
            ) : (
              <>
                {/* Cards de estatísticas */}
                <div className='dashboard__cards'>
                  <div className='dashboard__card'>
                    <i className='fa-solid fa-flag'></i>
                    <div>
                      <h3>{stats?.total || 0}</h3>
                      <p>Total de reclamações</p>
                    </div>
                  </div>
                  <div className='dashboard__card'>
                    <i className='fa-solid fa-users'></i>
                    <div>
                      <h3>{stats?.totalUsers || 0}</h3>
                      <p>Total de usuários</p>
                    </div>
                  </div>
                  <div className='dashboard__card dashboard__card--green'>
                    <i className='fa-solid fa-circle-check'></i>
                    <div>
                      <h3>{stats?.byStatus?.find(s => s._id === 'resolvida')?.total || 0}</h3>
                      <p>Resolvidas</p>
                    </div>
                  </div>
                  <div className='dashboard__card dashboard__card--yellow'>
                    <i className='fa-solid fa-clock'></i>
                    <div>
                      <h3>{stats?.byStatus?.find(s => s._id === 'pendente')?.total || 0}</h3>
                      <p>Pendentes</p>
                    </div>
                  </div>
                </div>

                {/* Gráficos */}
                <div className='dashboard__graficos'>

                  {/* Por categoria */}
                  <div className='dashboard__grafico__card'>
                    <h3>Reclamações por categoria</h3>
                    <div className='grafico__barras'>
                      {stats?.byCategory?.map((item) => (
                        <div key={item._id} className='grafico__barra__row'>
                          <span className='grafico__label'>
                            {categoriaLabel[item._id] || item._id}
                          </span>
                          <div className='grafico__barra__bg'>
                            <div
                              className='grafico__barra__fill'
                              style={{ width: `${(item.total / maxCategoria) * 100}%` }}
                            />
                          </div>
                          <span className='grafico__valor'>{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Por bairro */}
                  <div className='dashboard__grafico__card'>
                    <h3>Reclamações por bairro</h3>
                    <div className='grafico__barras'>
                      {stats?.byNeighborhood?.slice(0, 6).map((item) => (
                        <div key={item._id} className='grafico__barra__row'>
                          <span className='grafico__label'>{item._id}</span>
                          <div className='grafico__barra__bg'>
                            <div
                              className='grafico__barra__fill grafico__barra__fill--blue'
                              style={{ width: `${(item.total / (stats.byNeighborhood[0]?.total || 1)) * 100}%` }}
                            />
                          </div>
                          <span className='grafico__valor'>{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Reclamações recentes */}
                <div className='dashboard__recentes'>
                  <h3>Últimas reclamações</h3>
                  <table className='dashboard__tabela'>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Usuário</th>
                        <th>Bairro</th>
                        <th>Categoria</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentReports?.map((r) => {
                        const status = statusConfig[r.status] || statusConfig.pendente
                        return (
                          <tr key={r._id}>
                            <td>{r.title}</td>
                            <td>{r.userId?.name}</td>
                            <td>{r.location?.neighborhood}</td>
                            <td>{categoriaLabel[r.category]}</td>
                            <td>
                              <span className='tabela__status' style={{ color: status.cor, backgroundColor: status.bg }}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <button className='link__btn' onClick={() => setAbaAtiva('reclamacoes')}>
                    Ver todas as reclamações →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ABA RECLAMAÇÕES */}
        {abaAtiva === 'reclamacoes' && (
          <>
            <h1 className='dashboard__titulo'>Reclamações</h1>

            {/* Filtros */}
            <div className='dashboard__filtros'>
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
            </div>

            {/* Tabela */}
            <div className='dashboard__tabela__wrapper'>
              <table className='dashboard__tabela'>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Usuário</th>
                    <th>Bairro</th>
                    <th>Categoria</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => {
                    const status = statusConfig[r.status] || statusConfig.pendente
                    const data = new Date(r.createdAt).toLocaleDateString('pt-BR')
                    return (
                      <tr key={r._id}>
                        <td>{r.title}</td>
                        <td>{r.userId?.name}</td>
                        <td>{r.location?.neighborhood}</td>
                        <td>{categoriaLabel[r.category]}</td>
                        <td>{data}</td>
                        <td>
                          <span className='tabela__status' style={{ color: status.cor, backgroundColor: status.bg }}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div className='tabela__acoes'>
                            <button className='tabela__btn' onClick={() => abrirModal(r)}>
                              <i className='fa-solid fa-pen'></i>
                            </button>
                            <button className='tabela__btn tabela__btn--red' onClick={() => deletarReport(r._id)}>
                              <i className='fa-solid fa-trash'></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className='dashboard__paginacao'>
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className='tabela__btn'
              >
                <i className='fa-solid fa-chevron-left'></i>
              </button>
              <span>Página {pagina} de {totalPaginas}</span>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className='tabela__btn'
              >
                <i className='fa-solid fa-chevron-right'></i>
              </button>
            </div>
          </>
        )}

      </div>

      {/* Modal */}
      {modalAberto && reclamacaoSelecionada && (
        <div className='modal__overlay' onClick={fecharModal}>
          <div className='modal__card' onClick={(e) => e.stopPropagation()}>

            <div className='modal__header'>
              <h3>Atualizar status</h3>
              <button className='modal__fechar' onClick={fecharModal}>
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>

            <div className='modal__body'>
              <p className='modal__titulo__rec'>{reclamacaoSelecionada.title}</p>

              <div className='form__grupo'>
                <label>Novo status</label>
                <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)}>
                  <option value='pendente'>Pendente</option>
                  <option value='em_analise'>Em análise</option>
                  <option value='resolvida'>Resolvida</option>
                  <option value='duplicada'>Duplicada</option>
                </select>
              </div>

              <div className='form__grupo'>
                <label>Comentário do admin (opcional)</label>
                <textarea
                  value={comentarioAdmin}
                  onChange={(e) => setComentarioAdmin(e.target.value)}
                  placeholder='Ex: Problema encaminhado para a Secretaria de Infraestrutura...'
                  rows={3}
                />
              </div>
            </div>

            <div className='modal__footer'>
              <button className='modal__cancelar' onClick={fecharModal}>Cancelar</button>
              <button className='btn__primary' onClick={salvarStatus} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard