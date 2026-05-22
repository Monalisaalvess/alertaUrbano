import   {useState}  from 'react'
import {useNavigate} from 'react-router-dom'
import    useAuth    from '../hooks/useAuth'
import {authService} from '../Services/api'

import './Login.css'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [  erro, setErro  ]   = useState('');
  const [sucesso, setSucesso] = useState('');

  const [formData, setFormData] = useState ({
    name:'', 
    email:'', 
    password:'',
    confirmPassword:'',
});

  const { login } = useAuth ()
  const  navigate = useNavigate()

  const handleChange = (e)=> {
    const{ name, value } = e.targer
      setFormData((prev) => ({...prev, [name]: value}))
      setErro('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const res = await authService.login({
        email:formData.email,
        password: formData.password,
      })
      login(res.data.user, res.data.token)

      if(res.data.user.role === 'admin') {
        navigate('/dashboard')
      }else{
        navigate('/')
      }
    } catch (err) {
        setErro(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading (false)
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault()
    setErro('')
      if(formData.password !== formData.confirmPassword){
        setErro('As senhas não coincidem')
        return
    }
    setLoading(true)

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      setSucesso('Cadastro realizado! Verifique seu email para ativar sua conta.')
      setFormData({name:'', email:'', password:'', confirmPassword: ''})
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar')
    } finally{
      setLoading(false)
    }
  }

  return (  
  <div className='login__home'>
    <div className={`login__card ${!isLogin ? 'cadastro' : ''}`}>
      
      <div className='login__imagem'>
        <div className='login__imagem__texto'>
          
        </div>
      </div>

      <div className='login__formulario'>
        <div className='login__logo'>
          <h2>AlertaUrbano</h2>
        </div>

        <h1 className='login__title'>
          {isLogin ? 'Entrar' : 'Criar conta'}
        </h1>

        <p className='login__sub'>
          {isLogin ? 'Acesse sua conta para continuar' : 'É rápido e fácil.'}
        </p>

        {erro && <div className='login__erro'>{erro}</div>}
        {sucesso && <div className='login__sucesso'>{sucesso}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className='login__form'>
          {!isLogin && (
            <div className='form__grupo'>
              <label htmlFor='name'>Nome completo</label>
              <input type='text' id='name' name='name'
                value={formData.name} onChange={handleChange}
                placeholder='Seu nome completo' required />
            </div>
          )}

          <div className='form__grupo'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email'
              value={formData.email} onChange={handleChange}
              placeholder='seu@email.com' required />
          </div>

          <div className='form__grupo'>
            <label htmlFor='password'>Senha</label>
            <input type='password' id='password' name='password'
              value={formData.password} onChange={handleChange}
              placeholder='••••••••' required />
          </div>

          {!isLogin && (
            <div className='form__grupo'>
              <label htmlFor='confirmPassword'>Confirmar senha</label>
              <input type='password' id='confirmPassword' name='confirmPassword'
                value={formData.confirmPassword} onChange={handleChange}
                placeholder='••••••••' required />
            </div>
          )}

          <button type='submit' className='btn__primary' disabled={loading}>
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {!isLogin && (
          <p className='login__aviso'>
            <i className='fa-solid fa-envelope'></i> Enviaremos um email de confirmação para o endereço informado.
          </p>
        )}

        <p className='login__switch'>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button type='button' className='link__btn'
            onClick={() => { setIsLogin(!isLogin); setErro(''); setSucesso('') }}>
            {isLogin ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </div>

    </div>
  </div>
)
}

export default Login