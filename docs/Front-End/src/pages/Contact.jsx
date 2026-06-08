import './Contact.css'
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const nome = e.target.nome.value
    const email = e.target.email.value
    const mensagem = e.target.mensagem.value

    const mailto = `mailto:alertaurbanocrato@gmail.com?subject=Contato AlertaUrbano - ${nome}&body=Nome: ${nome}%0AEmail: ${email}%0A%0AMensagem:%0A${mensagem}`

    window.location.href = mailto
  }

  return (
    <div className='contato__page'>

      <div className='contato__header'>
        <h1>Fale conosco</h1>
        <p>Tem alguma dúvida, sugestão ou problema? Entre em contato.</p>
      </div>

      <div className='contato__container'>

        <div className='contato__info'>
          <div className='contato__info__item'>
            <i className='fa-solid fa-envelope'></i>
            <div>
              <h4>Email</h4>
              <p>alertaurbanocrato@gmail.com</p>
            </div>
          </div>

          <div className='contato__info__item'>
            <i className='fa-solid fa-clock'></i>
            <div>
              <h4>Tempo de resposta</h4>
              <p>Respondemos em até 48 horas úteis</p>
            </div>
          </div>

          <div className='contato__info__item'>
            <i className='fa-solid fa-circle-info'></i>
            <div>
              <h4>Sobre o projeto</h4>
              <p>AlertaUrbano é um projeto de extensão universitária desenvolvido para a cidade do Crato CE.</p>
            </div>
          </div>
        </div>

        <form className='contato__form' onSubmit={handleSubmit}>

          <div className='form__grupo'>
            <label htmlFor='nome'>
              <i className='fa-solid fa-user'></i> Nome
            </label>
            <input
              type='text'
              id='nome'
              name='nome'
              placeholder='Seu nome'
              required
            />
          </div>

          <div className='form__grupo'>
            <label htmlFor='email'>
              <i className='fa-solid fa-envelope'></i> Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='seu@email.com'
              required
            />
          </div>

          <div className='form__grupo'>
            <label htmlFor='mensagem'>
              <i className='fa-solid fa-message'></i> Mensagem
            </label>
            <textarea
              id='mensagem'
              name='mensagem'
              placeholder='Escreva sua mensagem aqui...'
              rows={5}
              required
            />
          </div>

          <button type='submit' className='btn__primary'>
            <i className='fa-solid fa-paper-plane'></i> Enviar mensagem
          </button>

          <p className='contato__aviso'>
            <i className='fa-solid fa-circle-info'></i> Ao clicar em enviar, seu cliente de email será aberto automaticamente.
          </p>

        </form>

      </div>
    </div>
  )
}

export default Contact