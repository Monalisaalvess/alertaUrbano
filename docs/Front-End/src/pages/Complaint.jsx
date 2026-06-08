import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { reportService } from '../services/api'
import './Complaint.css'

  const CATEGORIAS = [
    { value: 'buraco',     label: 'Buraco na via',      icone: 'fa-road-circle-exclamation' },
    { value: 'iluminacao', label: 'Iluminação pública',  icone: 'fa-lightbulb' },
    { value: 'lixo',       label: 'Lixo acumulado',      icone: 'fa-trash' },
    { value: 'saneamento', label: 'Saneamento',           icone: 'fa-faucet' },
    { value: 'seguranca',  label: 'Segurança pública',   icone: 'fa-shield-halved' },
    { value: 'outro',      label: 'Outro',                icone: 'fa-circle-dot' },
  ]
  
  const BAIRROS = [
    'Aderson Tavares Bezerra','Alto da Penha','Área Rural de Crato',
    'Baixio das Palmeiras','Barro Branco','Bela Vista',
    'Cacimbas','Campo Alegre','Centro','Coqueiro','Cruz',
    'Dom Francisco','Dom Quintino',
    'Franca Alencar','Gisélia Pinheiro','Batateira','Grangeiro',
    'Independência','Lameiro','Mirandão','Muriti','Mutirão','Nossa Senhora de Fátima',
    'Novo Crato','Novo Horizonte','Novo Lameiro','Ossian Araripe','Palmeiral',
    'Pantanal','Parque Grangeiro','Parque Recreio','Pimenta','Pinto Madeira',
    'Ponta da Serra','Santa Fé','Santa Luzia','Santa Rosa',
    'São Bento','São José','São Miguel','Seminário','Sossego',
    'Vila Alta','Vila Lobo','Zacarias Gonçalves',
    'Conjunto Barro Branco I','Conjunto Barro Branco II','Conjunto Novo Crato',
    'Conjunto Santa Luzia','Vila São Bento',
    'Vila Padre Cícero','Vila Gregório',
    'Vila Rica','Vila Nova','Vila Feliz','Vila Santa Terezinha',
    'Parque das Timbaúbas','Parque Recreio II',
    'Residencial Monsenhor Montenegro','Residencial Filemon Limaverde',
    'Residencial Tenente Coelho','Residencial Vitória Nossa',
    'Residencial Raimundo Bezerra','Residencial Wilson Gonçalves',
    'Loteamento Conviver','Loteamento Jardim Horizonte',
    'Loteamento Franca Alencar','Loteamento Novo Crato',
    'Loteamento Cidade Universitária',
    'Outro',
  ]
  
  const FORM_INICIAL = {
    title:        '',
    description:  '',
    category:     '',
    neighborhood: '',
    address:      '',
    image:        null,
  }
  
  const MAX_DESC = 1500
  const MAX_IMG  = 5 * 1024 * 1024

  const Reclamacoes = () => {
    const { isAuthenticated } = useAuth()
    const navigate            = useNavigate()
  
    const [loading,  setLoading]  = useState(false)
    const [erro,     setErro]     = useState('')
    const [sucesso,  setSucesso]  = useState('')
    const [preview,  setPreview]  = useState(null)
    const [formData, setFormData] = useState(FORM_INICIAL)
  
    useEffect(() => {
      if (!isAuthenticated) navigate('/login')
    }, [isAuthenticated, navigate])

    useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview)
      }
    }, [preview])
  
    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      setErro('')
    }
  
    const handleImage = (e) => {
      const file = e.target.files[0]
      if (!file) return
  
      if (file.size > MAX_IMG) {
        setErro('A imagem deve ter no máximo 5MB')
        return
      }
  
      if (preview) URL.revokeObjectURL(preview)
  
      setFormData((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file))
      setErro('')
    }
  
    const handleRemoverImagem = () => {
      if (preview) URL.revokeObjectURL(preview)
      setFormData((prev) => ({ ...prev, image: null }))
      setPreview(null)
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setErro('')
  
      if (!formData.image) {
        setErro('A imagem é obrigatória')
        return
      }
  
      setLoading(true)
  
      try {
        const data = new FormData()
        data.append('title',        formData.title)
        data.append('description',  formData.description)
        data.append('category',     formData.category)
        data.append('neighborhood', formData.neighborhood)
        data.append('address',      formData.address)
        data.append('image',        formData.image)
  
        await reportService.create(data)
  
        setSucesso('Reclamação enviada com sucesso!')
        setFormData(FORM_INICIAL)
        setPreview(null)
  
        setTimeout(() => navigate('/'), 2000)
      } catch (err) {
        setErro(err.response?.data?.error || 'Erro ao enviar reclamação')
      } finally {
        setLoading(false)
      }
    }


  return (
<div className='reclamacoes__page'>
 
      <div className='reclamacoes__header'>
        <span className='reclamacoes__header__badge'>
          <i className='fa-solid fa-triangle-exclamation'></i> Nova reclamação
        </span>
        <h1>Registre um problema na sua cidade</h1>
        <p>Preencha os dados abaixo para registrar sua reclamação.</p>
      </div>
 
      <div className='reclamacoes__container'>
        <form onSubmit={handleSubmit} className='reclamacoes__form'>
 
          {erro   && (
            <div className='form__erro'>
              <i className='fa-solid fa-circle-exclamation'></i> {erro}
            </div>
          )}
          {sucesso && (
            <div className='form__sucesso'>
              <i className='fa-solid fa-circle-check'></i> {sucesso}
            </div>
          )}
 
          <div className='form__grupo'>
            <label htmlFor='title'>Título da reclamação</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Ex: Buraco na Rua das Flores, perto da escola'
              maxLength={100}
              required
            />
          </div>

          <div className='form__linha'>
            <div className='form__grupo'>
              <label htmlFor='category'>Categoria</label>
              <select
                id='category'
                name='category'
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value=''>Selecione a categoria</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
 
            <div className='form__grupo'>
              <label htmlFor='neighborhood'>Bairro</label>
              <select
                id='neighborhood'
                name='neighborhood'
                value={formData.neighborhood}
                onChange={handleChange}
                required
              >
                <option value=''>Selecione o bairro</option>
                {BAIRROS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
 
          <div className='form__grupo'>
            <label htmlFor='address'>Endereço completo</label>
            <input
              type='text'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Rua, número, ponto de referência...'
              required
            />
          </div>
 
          <div className='form__grupo'>
            <label htmlFor='description'>Descrição detalhada</label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Descreva o problema com o máximo de detalhes possível...'
              maxLength={MAX_DESC}
              rows={4}
              required
            />
            <span className='form__contador'>
              {formData.description.length}/{MAX_DESC}
            </span>
          </div>
 
          <div className='form__grupo'>
            <label>
              <i className='fa-solid fa-camera'></i> Foto do problema
              <span className='form__label__obrigatorio'> obrigatória</span>
            </label>
 
            {!preview ? (
              <label htmlFor='image' className='upload__area'>
                <i className='fa-solid fa-cloud-arrow-up'></i>
                <span>Clique para selecionar ou arraste a imagem aqui</span>
                <span className='upload__info'>JPG, PNG ou WEBP — máximo 5MB</span>
                <input
                  type='file'
                  id='image'
                  name='image'
                  accept='image/jpeg,image/png,image/webp'
                  onChange={handleImage}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div className='upload__preview'>
                <img src={preview} alt='Preview da imagem selecionada' />
                <button
                  type='button'
                  className='upload__remover'
                  onClick={handleRemoverImagem}
                  aria-label='Remover imagem'
                >
                  <i className='fa-solid fa-xmark'></i>
                </button>
              </div>
            )}
          </div>
 
          <button type='submit' className='btn__primary' disabled={loading}>
            {loading
              ? <><i className='fa-solid fa-spinner fa-spin'></i> Enviando...</>
              : <><i className='fa-solid fa-paper-plane'></i> Enviar reclamação</>
            }
          </button>
 
        </form>
      </div>
    </div>
  )
}
 

export default Reclamacoes