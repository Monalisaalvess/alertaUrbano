import { useState, useEffect, useCallback} from 'react'
import     { useNavigate }     from 'react-router-dom'
import          useAuth        from '../hooks/useAuth'
import    { adminService }     from '../services/api'

import './Dashboard.css'

const STATUS_CONFIG = {
  pendente:   { label: 'Pendente',   cor: '#ffba00', bg: '#fffbeb' },
  em_analise: { label: 'Em análise', cor: '#0c266d', bg: '#eff6ff' },
  resolvida:  { label: 'Resolvida',  cor: '#0c3b2e', bg: '#f0fdf4' },
}

const CATEGORIA_LABEL  = {
  buraco:     'Buraco',
  iluminacao: 'Iluminação',
  lixo:       'Lixo',
  saneamento: 'Saneamento',
  seguranca:  'Segurança',
  outro:      'Outro',
}

const FILTROS_INICIAIS = { status: '', category: '', neighborhood: '' }

const TabelaRow = ({ report, onEditar, onDeletar }) => {
  const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.pendente
  const data   = new Date(report.createdAt).toLocaleDateString('pt-BR')
 
  return (
    <tr>
      <td>{report.title}</td>
      <td>{report.userId?.name ?? '—'}</td>
      <td>{report.location?.neighborhood ?? '—'}</td>
      <td>{CATEGORIA_LABEL[report.category] ?? report.category}</td>
      <td>{data}</td>
      <td>
        <span
          className='tabela__status'
          style={{ color: status.cor, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </td>
      <td>
        <div className='tabela__acoes'>
          <button
            className='tabela__btn'
            onClick={() => onEditar(report)}
            aria-label='Editar status'
          >
            <i className='fa-solid fa-pen'></i>
          </button>
          <button
            className='tabela__btn tabela__btn--red'
            onClick={() => onDeletar(report._id)}
            aria-label='Remover reclamação'
          >
            <i className='fa-solid fa-trash'></i>
          </button>
        </div>
      </td>
    </tr>
  )
}

const Dashboard = () => {
  const { isAdmin, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
 
  const [stats,                 setStats]                 = useState(null)
  const [reports,               setReports]               = useState([])
  const [loading,               setLoading]               = useState(true)
  const [pagina,                setPagina]                = useState(1)
  const [totalPaginas,          setTotalPaginas]          = useState(1)
  const [filtros,               setFiltros]               = useState(FILTROS_INICIAIS)
  const [modalAberto,           setModalAberto]           = useState(false)
  const [reclamacaoSelecionada, setReclamacaoSelecionada] = useState(null)
  const [novoStatus,            setNovoStatus]            = useState('')
  const [comentarioAdmin,       setComentarioAdmin]       = useState('')
  const [abaAtiva,              setAbaAtiva]              = useState('dashboard')
  const [salvando,              setSalvando]              = useState(false)
 
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/')
    }
  }, [isAuthenticated, isAdmin, navigate])

  const carregarDados = useCallback(async () => {
    try {
      const res = await adminService.getStats()
      setStats(res.data)
    } catch (err) {
      console.error('Erro ao carregar stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])
 
  const carregarReports = useCallback(async () => {
    try {
      const res = await adminService.getReports({ ...filtros, page: pagina, limit: 10 })
      setReports(res.data.reports)
      setTotalPaginas(res.data.pagination.pages)
    } catch (err) {
      console.error('Erro ao carregar reports:', err)
    }
  }, [filtros, pagina])
 
  useEffect(() => {
    if (isAuthenticated && isAdmin) carregarDados()
  }, [isAuthenticated, isAdmin, carregarDados])
 
  useEffect(() => {
    if (isAuthenticated && isAdmin) carregarReports()
  }, [isAuthenticated, isAdmin, carregarReports])
 

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
        status:       novoStatus,
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
  
    if (!window.confirm('Tem certeza que deseja remover esta reclamação?')) return
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
 
  const maxCategoria    = stats?.byCategory?.[0]?.total    || 1
  const maxNeighborhood = stats?.byNeighborhood?.[0]?.total || 1
 
  return (
    <div className='dashboard__page'>
 
      <aside className='dashboard__sidebar'>
        <div className='dashboard__sidebar__logo'>
          <h2>AlertaUrbano</h2>
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
      </aside>
 
      <main className='dashboard__conteudo'>
        {abaAtiva === 'dashboard' && (
          <>
            <h1 className='dashboard__titulo'>Dashboard</h1>
 
            {loading ? (
              <div className='dashboard__loading'>
                <i className='fa-solid fa-spinner fa-spin'></i> Carregando...
              </div>
            ) : (
              <>
                
                <div className='dashboard__cards'>
                  <div className='dashboard__card'>
                   
                    <div>
                      <h3>{stats?.total ?? 0}</h3>
                      <p>Total de reclamações</p>
                    </div>
                  </div>
                  <div className='dashboard__card'>
                  
                    <div>
                      <h3>{stats?.totalUsers ?? 0}</h3>
                      <p>Total de usuários</p>
                    </div>
                  </div>
                  <div className='dashboard__card dashboard__card--green'>
                    
                    <div>
                      <h3>{stats?.byStatus?.find(s => s._id === 'resolvida')?.total ?? 0}</h3>
                      <p>Resolvidas</p>
                    </div>
                  </div>
                  <div className='dashboard__card dashboard__card--yellow'>
                  
                    <div>
                      <h3>{stats?.byStatus?.find(s => s._id === 'pendente')?.total ?? 0}</h3>
                      <p>Pendentes</p>
                    </div>
                  </div>
                </div>
 
                <div className='dashboard__graficos'>
 
                  <div className='dashboard__grafico__card'>
                    <h3>Reclamações por categoria</h3>
                    <div className='grafico__barras'>
                      {stats?.byCategory?.map((item) => (
                        <div key={item._id} className='grafico__barra__row'>
                          <span className='grafico__label'>
                            {CATEGORIA_LABEL[item._id] ?? item._id}
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
 
                  <div className='dashboard__grafico__card'>
                    <h3>Reclamações por bairro</h3>
                    <div className='grafico__barras'>
                      {stats?.byNeighborhood?.slice(0, 6).map((item) => (
                        <div key={item._id} className='grafico__barra__row'>
                          <span className='grafico__label'>{item._id}</span>
                          <div className='grafico__barra__bg'>
                            <div
                              className='grafico__barra__fill grafico__barra__fill--blue'

                              style={{ width: `${(item.total / maxNeighborhood) * 100}%` }}
                            />
                          </div>
                          <span className='grafico__valor'>{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
 
                </div>
 
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
                      {stats?.recentReports?.map((report) => {
                        const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.pendente
                        return (
                          <tr key={report._id}>
                            <td>{report.title}</td>
                            <td>{report.userId?.name ?? '—'}</td>
                            <td>{report.location?.neighborhood ?? '—'}</td>
                            <td>{CATEGORIA_LABEL[report.category] ?? report.category}</td>
                            <td>
                              <span
                                className='tabela__status'
                                style={{ color: status.cor, backgroundColor: status.bg }}
                              >
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
 
        {abaAtiva === 'reclamacoes' && (
          <>
            <h1 className='dashboard__titulo'>Reclamações</h1>
 
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
                  {reports.map((report) => (
                    <TabelaRow
                      key={report._id}
                      report={report}
                      onEditar={abrirModal}
                      onDeletar={deletarReport}
                    />
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className='dashboard__paginacao'>
              <button
                className='tabela__btn'
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                aria-label='Página anterior'
              >
                <i className='fa-solid fa-chevron-left'></i>
              </button>
              <span>Página {pagina} de {totalPaginas}</span>
              <button
                className='tabela__btn'
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                aria-label='Próxima página'
              >
                <i className='fa-solid fa-chevron-right'></i>
              </button>
            </div>
          </>
        )}
 
      </main>

      {modalAberto && reclamacaoSelecionada && (
        <div
          className='modal__overlay'
          onClick={fecharModal}
          role='dialog'
          aria-modal='true'
          aria-label='Atualizar status da reclamação'>
          <div className='modal__card' onClick={(e) => e.stopPropagation()}>
 
            <div className='modal__header'>
              <h3>Atualizar status</h3>
              <button className='modal__fechar' onClick={fecharModal} aria-label='Fechar modal'>
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>
 
            <div className='modal__body'>
              <p className='modal__titulo__rec'>{reclamacaoSelecionada.title}</p>
 
              <div className='form__grupo'>
                <label htmlFor='novoStatus'>Novo status</label>
                <select
                  id='novoStatus'
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}   >
                  <option value='pendente'>Pendente</option>
                  <option value='em_analise'>Em análise</option>
                  <option value='resolvida'>Resolvida</option>
                  <option value='duplicada'>Duplicada</option>
                </select>
              </div>
 
              <div className='form__grupo'>
                <label htmlFor='comentarioAdmin'>Comentário do admin (opcional)</label>
                <textarea
                  id='comentarioAdmin'
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